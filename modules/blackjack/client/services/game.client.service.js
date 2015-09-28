'use strict';

//Games service used for communicating with the games REST endpoints
angular
	.module('game')
	.factory('GameService', GameService);

// Using Angular built in $resource to handle the REST endpoint calls.  
// Considered using RESTAngular library, but this game is simple enough it was not needed.
GameService.$inject = ['$resource'];

function GameService($resource) {
	var BaseURL = '/api/game/';

	// Expose all service methods as named functions for better readability.
	return {
		createGame: createGame,
		joinGame: joinGame,
		hit: hit,
		stand: stand,
		deal: deal,
		getStats: getStats
	};

	// POST /api/game/new
	function createGame() {
		var GameResource = $resource(BaseURL + 'new'); 
		var newGame = new GameResource();
		return newGame.$save();
	}

	// POST /api/game/:gameId/join
	function joinGame(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/join');
		var game = new GameResource();
		return game.$save({gameId:gameId});
	}

	// POST /api/game/:gameId/hit
	function hit(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/hit');
		var game = new GameResource();
		return game.$save({gameId:gameId});
	}

	// POST /api/game/:gameId/stand
	function stand(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/stand');
		var game = new GameResource();
		return game.$save({gameId:gameId});
	}

	// POST /api/game/:gameId/deal
	function deal(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/deal');
		var game = new GameResource();
		return game.$save({gameId:gameId});
	}

	// GET /api/game/:gameId/stats
	function getStats(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/stats', {gameId: gameId});
		return GameResource.get().$promise;
	}
}
