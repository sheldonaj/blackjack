'use strict';

/**
 * Module dependencies.
 */
var game = require('../controllers/game.server.controller');
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

module.exports = function (app) {
  app.post('/api/game/new', function (req, res) {
    game.newGame(function(err, currentGame) {
    	if(err) {
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

  app.post('/api/game/:gameId/join', function (req, res) {
  	game.getGame(req.params.gameId, function(err, currentGame) {
    	if(err) {
    		return res.status(404).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.send(game.generateResponse(currentGame));
     	}
    });
  });

  app.post('/api/game/:gameId/hit', function (req, res) {
  	game.getGame(req.params.gameId, function(err, currentGame) {
  		if(err) {
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

  app.post('/api/game/:gameId/stand', function (req, res) {
  	game.getGame(req.params.gameId, function(err, currentGame) {
  		if(err) {
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

  app.post('/api/game/:gameId/deal', function (req, res) {
  	game.getGame(req.params.gameId, function(err, currentGame) {
  		if(err) {
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

  app.get('/api/game/:gameId/stats', function (req, res) {
    game.getStats(req.params.gameId, function(err, stats) {
    	if(err) {
    		return res.status(404).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.json(stats);
     	}
    });
  });
};