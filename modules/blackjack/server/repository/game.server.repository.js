'use strict';

// This file isolates and handles all database queries.

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  GameResult = mongoose.model('GameResult'),
  Game = mongoose.model('Game');

// Creates a new game document and saves in the db.
exports.saveGame = function (game, callback) {
  var gameToSave = new Game(game);
  gameToSave.save(function (err, doc) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, doc);
  });
};

// Finds and updates an existing game document.
exports.updateGame = function (game, callback) {
  var updatedGame = new Game(game);
  Game.findByIdAndUpdate(game._id, updatedGame, function (err) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, updatedGame);
  });
};

// Creates and saves a new hand result in the db.
exports.createGameRecord = function (game, playerScore, dealerScore, callback) {
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
};

// Retrieves a game from the db.
exports.getGame = function(gameId, callback) {
  Game.findById(gameId, function (err, doc) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, doc);
  });
};

// Gets the games wins stats, both for the current in progress table, as well as overall stats.
// There are some performance considerations here.  Current design issues four separate queries.
// Another approach would be to issue a single query that gets all results and then parse those results post query with lodash to
// determine the four data points.  However, if there potential are a lot of records, say 100000s of hand results, retrieving them all and parsing
// could be bad performance.  In that case using mongoose built-in count and executing it 4 times is probably the best.
// NOTE: async.parallel would clean this up a bit since the queries don't depend on each other.  
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