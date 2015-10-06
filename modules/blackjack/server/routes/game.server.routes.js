'use strict';

// The main game Expess route handling.

// In general the error handling is very light and overly simple.  Basically any error when getting any gameId or game stats 
// returns 404, not found.  Any other error is a 500 internal server error.  If this was for real more validation around the requests
// would be needed a better logic to determine what the failure was to map to correct error code.  

/**
 * Module dependencies.
 */
var game = require('../controllers/game.server.controller');
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

module.exports = function (app) {

	//IE 11 and Edge by default tries to cache every GET request, but that breaks multiple GETs against the same game ID.
	//Supply headers telling the browser not to do this caching.  
	app.use(function noCache(req, res, next){
	    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	    res.header("Pragma", "no-cache");
	    res.header("Expires",0);
	    next();
	});

  // POST /api/games
  // Create a new game
  app.post('/api/games', function (req, res) {
    game.newGame(function(err, currentGame) {
      if(err || !currentGame) {
        return res.status(500).send({
            message: errorHandler.getErrorMessage(err)
          });
      }
      game.newHand(currentGame, function(err, currentGame) {
        if(err) {
          return res.status(500).send({
              message: errorHandler.getErrorMessage(err)
            });
        } else {
          res.status(201).send(game.generateResponse(currentGame));
        }
      });
   });
  });

  // GET /api/game/:gameId
  // Retrieve an existing game
  app.get('/api/games/:gameId', function (req, res) {
    game.getGame(req.params.gameId, function(err, currentGame) {
      if(err || !currentGame) {
        return res.status(404).send({
            message: errorHandler.getErrorMessage(err)
          });
      } else {
        res.send(game.generateResponse(currentGame));
      }
    });
  });

// PATCH /api/game/:gameId/
// Update an existing game.
// body will contain the updateType: hit || stand || deal.
  app.patch('/api/games/:gameId', function (req, res) {
    game.getGame(req.params.gameId, function(err, currentGame) {
      if(err || !currentGame) {
        return res.status(404).send({
            message: errorHandler.getErrorMessage(err)
          });
      }
      var updateType = req.body.updateType;
      if(!updateType) {
        return res.status(400).send({message: 'Missing Action'});
      }
      game.update(currentGame, updateType, function(err, currentGame) {
        if(err) {
          return res.status(500).send({
              message: errorHandler.getErrorMessage(err)
            });
        } else {
          res.send(game.generateResponse(currentGame));
        }
      });
    });
  });

	// GET /api/game/:gameId/stats
  app.get('/api/games/:gameId/stats', function (req, res) {
    game.getStats(req.params.gameId, function(err, stats) {
    	if(err || !stats) {
    		return res.status(404).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.json(stats);
     	}
    });
  });
};