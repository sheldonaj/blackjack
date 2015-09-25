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

	function joinGame() {
		var gameResource = $resource(BaseURL + 'join');
		var game = new gameResource();
		return game.$save();
	};

	function hit() {
		var gameResource = $resource(BaseURL + 'hit');
		var game = new gameResource();
		return game.$save();
	};

	function stand() {
		var gameResource = $resource(BaseURL + 'stand');
		var game = new gameResource();
		return game.$save();
	};

	function deal() {
		var gameResource = $resource(BaseURL + 'deal');
		var game = new gameResource();
		return game.$save();
	};

	function getStats() {
		var gameResource = $resource(BaseURL + 'stats');
		return gameResource.get().$promise;
	}
}
