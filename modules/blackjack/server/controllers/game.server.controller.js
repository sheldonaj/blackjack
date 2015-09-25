'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  GameResult = mongoose.model('GameResult'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var drawDeck = null;
var cards = require('./cards');

// Blackjack game.
function BlackjackGame () {
    this.dealerHand = new BlackjackHand();
    this.playerHand = new BlackjackHand();
    this.dealerHiddenHand = new BlackjackHand();
    this.result = 'None';
    this.cards = cards.createPlayingCards();
}

BlackjackGame.prototype.newHand = function (callback) {

    this.dealerHand = new BlackjackHand();
    this.playerHand = new BlackjackHand();
    this.dealerHiddenHand = new BlackjackHand();

    this.playerHand.addCard(this.cards.dealNextCard());
    this.dealerHand.addCard(this.cards.dealNextCard());
    this.playerHand.addCard(this.cards.dealNextCard());
    this.dealerHiddenHand.addCard(this.dealerHand.cards[0]);
    this.dealerHiddenHand.addCard(this.cards.dealNextCard());

    if(this.dealerHiddenHand.getScore() === 21) {
      console.log("Got here");
      this.dealerHand = this.dealerHiddenHand;
      this.result = 'Lose';
      return this.createGameRecord(this.result, callback);
    }
    this.result = 'None';
    return callback();

}

BlackjackGame.prototype.isInProgress = function () {
    return (this.result === 'None') && (this.dealerHand.hasCards());
}

BlackjackGame.prototype.toJson = function () {
    return {
        dealer: {
            cards: this.dealerHand.getCards(),
            score: this.dealerHand.getScore()
        },
        player: {
            cards: this.playerHand.getCards(),
            score: this.playerHand.getScore()
        },
        result: this.result
    };
}

BlackjackGame.prototype.getResultForPlayer = function (callback) {
    var score = this.playerHand.getScore();
    this.result = 'None';
    if (score > 21) {
        this.result = 'Bust';
        return this.createGameRecord(this.result, callback);
    }
    return callback();
}

BlackjackGame.prototype.isGameInProgress = function () {
    return this.result === 'None';
}

BlackjackGame.prototype.hit = function (callback) {
    if (this.isGameInProgress()) {
        this.playerHand.addCard(this.cards.dealNextCard());
        var currentGame = this;
        this.getResultForPlayer(function (err) {
          if(err) {
            return callback(err);
          }
          return callback();
        });
    }
}

BlackjackGame.prototype.getResult = function (callback) {
    var playerScore = this.playerHand.getScore();
    var dealerScore = this.dealerHand.getScore();
    var result = 'Lose';

    if (this.playerHand.isBust()) {
        result = 'Bust';
    } else if (this.dealerHand.isBust()) {
        result = 'Win';
    }

    if (playerScore > dealerScore) {
        result = 'Win';
    } else if (playerScore === dealerScore) {
        result = 'Push';
    }

    this.result = result;
    return this.createGameRecord(result, callback);
}

BlackjackGame.prototype.stand = function (callback) {
    if (this.isGameInProgress()) {
      this.dealerHand = this.dealerHiddenHand;
        while (this.dealerHand.getScore() < 17) {
            this.dealerHand.addCard(this.cards.dealNextCard());        
        }
        this.getResult(function(err) {
          if(err) {
            return callback(err);
          }
          return callback();
        });
    }
}

BlackjackGame.prototype.createGameRecord = function (result, callback) {
  var playerScore = this.playerHand.getScore();
  var dealerScore = this.dealerHand.getScore();
  var winner = "Dealer";
  if(result === "Win") {
    winner = "Player";
  }
  var gameResult = new GameResult(
    {
      player: playerScore,
      dealer: dealerScore,
      winner: winner,
      result: result
    });
  gameResult.save(function (err) {
    if (err) {
      return callback(err);
    }
    return callback();
  });
}


// Blackjack hand.
function BlackjackHand() {
    this.cards = [];
}

BlackjackHand.prototype.hasCards = function () {
    return this.cards.length > 0;
}

BlackjackHand.prototype.addCard = function (card) {
    this.cards.push(card);
}

BlackjackHand.prototype.numberToSuit = function (number) {
  var suits = ['C', 'D', 'H', 'S'];
  var index = Math.floor(number / 13);
  return suits[index];
}

BlackjackHand.prototype.numberToCard = function (number) {
  return {
    rank: (number % 13) + 1,
    suit: this.numberToSuit(number)
  };
}

BlackjackHand.prototype.getCards = function () {
    var convertedCards = [];
    for (var i = 0; i < this.cards.length; i++) {
        var number = this.cards[i];
        convertedCards[i] = this.numberToCard(number);
    }
    return convertedCards;
}

BlackjackHand.prototype.getCardScore = function (card) {
    if (card.rank === 1) {
        return 11;
    } else if (card.rank >= 11) {
        return 10;
    }
    return card.rank;
}

BlackjackHand.prototype.getScore = function () {
    var score = 0;
    var cards = this.getCards();

    // Sum all cards
    for (var i = 0; i < cards.length; ++i) {
        var card = cards[i];
        score = score + this.getCardScore(card);
    }

    return score;
}

BlackjackHand.prototype.isBust = function () {
    return this.getScore() > 21;
}

// Exports.
exports.newGame = function () {
    return new BlackjackGame();
}

exports.getStats = function(callback) {
  GameResult.count({winner: "Player"}, function(err, playerWins) {
    if(err) {
      return callback(err, null);
    }
    console.log('playerWins is ' + playerWins);
    GameResult.count({winner: "Dealer"}, function(err, dealerWins) {
      if(err) {
        return callback(err, null);
      }
      console.log('dealerWins is ' + dealerWins);
      return callback(null, {playerWins: playerWins, dealerWins: dealerWins});
    });
  });
}