'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  GameResult = mongoose.model('GameResult'),
  Game = mongoose.model('Game'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var cards = require('./cards');

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
    saveGame(game, callback);
};

exports.newHand = function (game, callback) {
    game.dealer.cards = [];
    game.player.cards = [];
    game.dealer.hidden = [];

    game.player.cards.push(cards.dealNextCard(game));
    game.dealer.cards.push(cards.dealNextCard(game));
    game.player.cards.push(cards.dealNextCard(game));
    game.dealer.hidden.push(game.dealer.cards[0]);
    game.dealer.hidden.push(cards.dealNextCard(game));

    if(getScore(game.dealer.hidden) === 21) {
      game.dealer.cards = game.dealer.hidden;
      game.result = 'Lose';
      return createGameRecord(game, function(err) {
        updateGame(game, callback);
      });
    }
    game.result = 'None';
    return updateGame(game, callback);

};

function isInProgress (game) {
    return (game.result === 'None') && (game.dealer.cards.length() > 0);
}

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

exports.hit = function (game, callback) {
    if (isGameInProgress(game)) {
      game.player.cards.push(cards.dealNextCard(game));
      getResultForPlayer(game, function (err) {
        if(err) {
          return callback(err);
        }
        return updateGame(game, callback);
      });
    } else {
      return callback(null, game);
    }
};

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

exports.stand = function (game, callback) {
    if (isGameInProgress(game)) {
        game.dealer.cards = game.dealer.hidden;
        while (getScore(game.dealer.cards) < 17) {
            game.dealer.cards.push(cards.dealNextCard(game));
        }
        getResult(game, function(err) {
          if(err) {
            return callback(err);
          }
         return updateGame(game, callback);
        });
    } else {
      return callback(null, game);
    }
};

function saveGame (game, callback) {
  var gameToSave = new Game(game);
  gameToSave.save(function (err, doc) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, doc);
  });
}

function updateGame (game, callback) {
  var updatedGame = new Game(game);
  Game.findByIdAndUpdate(game._id, updatedGame, function (err, doc) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, updatedGame);
  });
}

function createGameRecord (game, callback) {
  var playerScore = getScore(game.player.cards);
  var dealerScore = getScore(game.dealer.cards);
  var winner = 'Dealer';
  if(game.result === 'Win') {
    winner = 'Player';
  }
  var gameResult = new GameResult(
    {
      gameId: game._id,
      player: playerScore,
      dealer: dealerScore,
      winner: winner,
      result: game.result
    });
  gameResult.save(function (err) {
    if (err) {
      return callback(err);
    }
    return callback();
  });
}

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

exports.getStats = function(gameId, callback) {
  GameResult.count({gameId: gameId, winner: 'Player'}, function(err, tablePlayerWins) {
    if(err) {
      return callback(err, null);
    }
    GameResult.count({gameId: gameId, winner: 'Dealer'}, function(err, tableDealerWins) {
      if(err) {
        return callback(err, null);
      }
      GameResult.count({winner: 'Player'}, function(err, allTimePlayerWins) {
        if(err) {
          return callback(err, null);
        }
        GameResult.count({winner: 'Dealer'}, function(err, allTimeDealerWins) {
          if(err) {
            return callback(err, null);
          }
          return callback(null, {tablePlayerWins: tablePlayerWins, tableDealerWins: tableDealerWins, allTimePlayerWins: allTimePlayerWins, allTimeDealerWins: allTimeDealerWins});
        });
      });
    });
  });
};

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
  Game.findById(gameId, function (err, doc) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, doc);
  });
};