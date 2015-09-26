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
		var gameResource = $resource(BaseURL + 'new'); 
		var newGame = new gameResource();
		return newGame.$save();
	};

	function joinGame(gameId) {
		var gameResource = $resource(BaseURL + ':gameId/join');
		var game = new gameResource();
		return game.$save({gameId:gameId});
	};

	function hit(gameId) {
		var gameResource = $resource(BaseURL + ':gameId/hit');
		var game = new gameResource();
		return game.$save({gameId:gameId});
	};

	function stand(gameId) {
		var gameResource = $resource(BaseURL + ':gameId/stand');
		var game = new gameResource();
		return game.$save({gameId:gameId});
	};

	function deal(gameId) {
		var gameResource = $resource(BaseURL + ':gameId/deal');
		var game = new gameResource();
		return game.$save({gameId:gameId});
	};

	// GET /api/game/:gameId/stats
	function getStats(gameId) {
		var gameResource = $resource(BaseURL + ':gameId/stats', {gameId: gameId});
		return gameResource.get().$promise;
	}
}
