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

	// POST /api/game/new
  app.post('/api/game/new', function (req, res) {
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
	     		res.send(game.generateResponse(currentGame));
	     	}
	    });
	});
  });

	// POST /api/game/:gameId/join
  app.post('/api/game/:gameId/join', function (req, res) {
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

  // The main POST actions follow the pattern of:
  // 1) Retreive the game at the given Id
  // 2) Perform the action against that game.

	// POST /api/game/:gameId/hit
  app.post('/api/game/:gameId/hit', function (req, res) {
  	game.getGame(req.params.gameId, function(err, currentGame) {
  		if(err || !currentGame) {
    		return res.status(404).send({
        		message: errorHandler.getErrorMessage(err)
        	});
	    }
	    game.hit(currentGame, function(err, currentGame) {
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

	// POST /api/game/:gameId/stand
  app.post('/api/game/:gameId/stand', function (req, res) {
  	game.getGame(req.params.gameId, function(err, currentGame) {
  		if(err || !currentGame) {
    		return res.status(404).send({
        		message: errorHandler.getErrorMessage(err)
        	});
	    }
	    game.stand(currentGame, function(err, currentGame) {
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

	// POST /api/game/:gameId/deal
  app.post('/api/game/:gameId/deal', function (req, res) {
  	game.getGame(req.params.gameId, function(err, currentGame) {
  		if(err || !currentGame) {
    		return res.status(404).send({
        		message: errorHandler.getErrorMessage(err)
        	});
	    }
	    game.newHand(currentGame, function(err, currentGame) {
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
  app.get('/api/game/:gameId/stats', function (req, res) {
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