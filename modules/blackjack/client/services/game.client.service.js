'use strict';

//Games service used for communicating with the games REST endpoints
angular
	.module('game')
	.factory('GameService', GameService);

// Using Angular built in $resource to handle the REST endpoint calls.  
// Considered using RESTAngular library, but this game is simple enough it was not needed.
GameService.$inject = ['$resource'];

function GameService($resource) {
	var BaseURL = '/api/games/';

	// Expose all service methods as named functions for better readability.
	return {
		createGame: createGame,
		getGame: getGame,
		hit: hit,
		stand: stand,
		deal: deal,
		getStats: getStats
	};

	// POST /api/games
	function createGame() {
		var GameResource = $resource(BaseURL); 
		var newGame = new GameResource();
		return newGame.$save();
	}

	// GET /api/games/:gameId
	function getGame(gameId) {
		var GameResource = $resource(BaseURL + ':gameId', {gameId: gameId});
		return GameResource.get().$promise;
	}

	// PATCH /api/games/:gameId  {updateType:hit}
	function hit(gameId) {
		var GameResource = $resource(BaseURL + ':gameId', null, {'update': {method: 'PATCH'}});
		var game = new GameResource({updateType: 'hit'});
		return game.$update({gameId:gameId});
	}

	// PATCH /api/games/:gameId {updateType:stand}
	function stand(gameId) {
		var GameResource = $resource(BaseURL + ':gameId', null, {'update': {method: 'PATCH'}});
		var game = new GameResource({updateType: 'stand'});
		return game.$update({gameId:gameId});
	}

	// PATCH /api/games/:gameId {updateType:deal}
	function deal(gameId) {
		var GameResource = $resource(BaseURL + ':gameId', null, {'update': {method: 'PATCH'}});
		var game = new GameResource({updateType: 'deal'});
		return game.$update({gameId:gameId});
	}

	// GET /api/game/:gameId/stats
	function getStats(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/stats', {gameId: gameId});
		return GameResource.get().$promise;
	}
}
