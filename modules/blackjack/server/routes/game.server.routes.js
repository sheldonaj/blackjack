'use strict';

/**
 * Module dependencies.
 */
var game = require('../controllers/game.server.controller');
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var blackjackGame = null;

module.exports = function (app) {
  app.post('/api/game/new', function (req, res) {
    blackjackGame = game.newGame();
    blackjackGame.newHand(function(err) {
    	if(err) {
    		return res.status(400).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.send(blackjackGame.toJson());
     	}
    });
  });

  app.post('/api/game/join', function (req, res) {
  	if(!blackjackGame) {
    	blackjackGame = game.newGame();
    	blackjackGame.newHand(function(err) {
    		if(err) {
    			return res.status(400).send({
        			message: errorHandler.getErrorMessage(err)
        		});
    		} else {
     			return res.send(blackjackGame.toJson());
     		}
    	});
	} else {
    	res.send(blackjackGame.toJson());
	}
  });

  app.post('/api/game/hit', function (req, res) {
    blackjackGame.hit(function(err) {
    	if(err) {
    		return res.status(400).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.send(blackjackGame.toJson());
     	}
    });
  });

  app.post('/api/game/stand', function (req, res) {
    blackjackGame.stand(function(err) {
    	if(err) {
    		return res.status(400).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.send(blackjackGame.toJson());
     	}
    });
  });

  app.post('/api/game/deal', function (req, res) {
    blackjackGame.newHand(function(err) {
    	if(err) {
    		return res.status(400).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.send(blackjackGame.toJson());
     	}
    });
  });

  app.get('/api/game/stats', function (req, res) {
    game.getStats(function(err, stats) {
    	if(err) {
    		return res.status(400).send({
        		message: errorHandler.getErrorMessage(err)
        	});
    	} else {
     		res.json(stats);
     	}
    });
  });
};