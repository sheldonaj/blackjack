'use strict';

//Games service used for communicating with the games REST endpoints
angular
	.module('game')
	.factory('GameService', GameService);

GameService.$inject = ['$resource'];

function GameService($resource) {
	var BaseURL = '/api/game/';

	return {
		createGame: createGame,
		joinGame: joinGame,
		hit: hit,
		stand: stand,
		deal: deal,
		getStats: getStats
	};

	function createGame() {
		var GameResource = $resource(BaseURL + 'new'); 
		var newGame = new GameResource();
		return newGame.$save();
	}

	function joinGame(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/join');
		var game = new GameResource();
		return game.$save({gameId:gameId});
	}

	function hit(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/hit');
		var game = new GameResource();
		return game.$save({gameId:gameId});
	}

	function stand(gameId) {
		var GameResource = $resource(BaseURL + ':gameId/stand');
		var game = new GameResource();
		return game.$save({gameId:gameId});
	}

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
