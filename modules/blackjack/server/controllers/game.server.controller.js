'use strict';

// Main game logic/data manipulation methods.
// The game state is persisted in the database, and each game (table) is stored in the db under a unique ID.
// Any method that changes the game state therefore must update the db document.  

/**
 * Module dependencies.
 */
var cards = require('./cards');
var gameRepository = require('../repository/game.server.repository');

// Initialize and create a new game.
exports.newGame = function (callback) {
    var game = {
        dealer: {
            cards: [],
            hidden: []
        },
        player: {
            cards: []
        },
        result: 'None',
        cards: cards.getShuffledPack(),
        deckLocation: 0
    };
    gameRepository.saveGame(game, callback);
};

// Deal a new hand
exports.newHand = function (game, callback) {
    game.dealer.cards = [];
    game.player.cards = [];
    game.dealer.hidden = [];

    game.player.cards.push(cards.dealNextCard(game));
    game.dealer.cards.push(cards.dealNextCard(game));
    game.player.cards.push(cards.dealNextCard(game));
    game.dealer.hidden.push(game.dealer.cards[0]);
    game.dealer.hidden.push(cards.dealNextCard(game));

    // Handle the case where the dealer gets 21 on their initial draw and make it an instant win.
    if(getScore(game.dealer.hidden) === 21) {
      game.dealer.cards = game.dealer.hidden;
      game.result = 'Lose';
      return createGameRecord(game, function(err) {
        gameRepository.updateGame(game, callback);
      });
    }
    game.result = 'None';
    return gameRepository.updateGame(game, callback);

};

// Whether hand is in progress
function isInProgress (game) {
    return (game.result === 'None') && (game.dealer.cards.length() > 0);
}

// Determine if player result ends hand (bust) or not.
function getResultForPlayer (game, callback) {
    var score = getScore(game.player.cards);
    game.result = 'None';
    if (score > 21) {
        game.result = 'Bust';
        return createGameRecord(game, callback);
    }
    return callback();
}

function isGameInProgress (game) {
    return game.result === 'None';
}

// Update the current game by performing a game action, hit, stand, or deal
exports.update = function(game, action, callback) {
    switch(action) {
        case 'hit': 
            return hit(game, callback);
        case 'stand':
            return stand(game, callback);
        case 'deal':
            return this.newHand(game, callback);
        default : 
            return callback("Invalid Action", null);
    }
}

// Player hit.  Deal them a card and check if hand is ended or not.
function hit (game, callback) {
    if (isGameInProgress(game)) {
      game.player.cards.push(cards.dealNextCard(game));
      getResultForPlayer(game, function (err) {
        if(err) {
          return callback(err);
        }
        return gameRepository.updateGame(game, callback);
      });
    } else {
      return callback(null, game);
    }
};

// Determine hand result.  
function getResult (game, callback) {
    var playerScore = getScore(game.player.cards);
    var dealerScore = getScore(game.dealer.cards);
    game.result = 'Lose';

    if (isBust(game.player.cards)) {
        game.result = 'Bust';
    } else if (isBust(game.dealer.cards)) {
        game.result = 'Win';
    }

    if (playerScore > dealerScore) {
        game.result = 'Win';
    } else if (playerScore === dealerScore) {
        game.result = 'Push';
    }
    return createGameRecord(game, callback);
}

// Player stands, hand is ended.  Dealer draws until they are over 17, then determine result.
function stand (game, callback) {
    if (isGameInProgress(game)) {
        game.dealer.cards = game.dealer.hidden;
        while (getScore(game.dealer.cards) < 17) {
            game.dealer.cards.push(cards.dealNextCard(game));
        }
        getResult(game, function(err) {
          if(err) {
            return callback(err);
          }
         return gameRepository.updateGame(game, callback);
        });
    } else {
      return callback(null, game);
    }
};

function isBust (cards) {
    return getScore(cards) > 21;
}

function numberToSuit (number) {
  var suits = ['C', 'D', 'H', 'S'];
  var index = Math.floor(number / 13);
  return suits[index];
}

function numberToCard (number) {
  return {
    rank: (number % 13) + 1,
    suit: numberToSuit(number)
  };
}

function getCards (cards) {
    var convertedCards = [];
    for (var i = 0; i < cards.length; i++) {
        var number = cards[i];
        convertedCards[i] = numberToCard(number);
    }
    return convertedCards;
}

function getCardScore (card) {
    if (card.rank === 1) {
        return 11;
    } else if (card.rank >= 11) {
        return 10;
    }
    return card.rank;
}

function getScore(hand) {
    var score = 0;
    var cards = getCards(hand);

    // Sum all cards
    for (var i = 0; i < cards.length; ++i) {
        var card = cards[i];
        score = score + getCardScore(card);
    }

    return score;
}

// request to write a finshed hand result to the database.
function createGameRecord(game, callback) {
  var playerScore = getScore(game.player.cards);
  var dealerScore = getScore(game.dealer.cards);
  gameRepository.createGameRecord(game, playerScore, dealerScore, callback);
}

exports.getStats = function(gameId, callback) {
  gameRepository.getStats(gameId, callback);
};

// Really if this was for "real" this should go in an API v1 file or something.
// This maps the JSON response for a game that the server sends to the client.  
// Isolating this in a versioned API file would allow the client to request API v1 then if there were any breaking changes in the future
// the client would be able to control if it wanted v1 or v2+ API responses.
exports.generateResponse = function(game) {
   return {
        dealer: {
            cards: getCards(game.dealer.cards),
            score: getScore(game.dealer.cards)
        },
        player: {
            cards: getCards(game.player.cards),
            score: getScore(game.player.cards)
        },
        result: game.result,
        id: game._id
    };
};

exports.getGame = function(gameId, callback) {
  gameRepository.getGame(gameId, callback); 
};