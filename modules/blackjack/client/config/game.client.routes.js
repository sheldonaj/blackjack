'use strict';

// Setting up client view routes
angular.module('game').config(['$stateProvider',
  function ($stateProvider) {
    // Three states:  
    // game = New Game, initial landing page.
    // game_inprogress = Main game view.  
    // game_stats = The game statistics view.
    $stateProvider
      .state('game', {
        url: '/newgame',
        templateUrl: 'modules/blackjack/views/newgame.client.view.html',
        controller: 'NewGameController',
        controllerAs: 'vm'
      })
      .state('game_inprogress', {
        url: '/games/:gameId',
        templateUrl: 'modules/blackjack/views/game.client.view.html',
        controller: 'GameController',
        controllerAs: 'vm',
        resolve: {
          currentGame: getGame
        }
      })
      .state('game_stats', {
        url: '/games/:gameId/stats',
        templateUrl: 'modules/blackjack/views/game.stats.client.view.html',
        controller: 'GameStatsController',
        controllerAs: 'vm',
        resolve: {
          gameStats: gameStats
        }
      });
  }
]);

// Whenever game_stats state route is requested, automatically resolve the gameStats api endpoint.  
gameStats.$inject = ['$stateParams', 'GameService'];
function gameStats($stateParams, GameService) {
  return GameService.getStats($stateParams.gameId);
}

// Whenever game_inprogress state route is requested, automatically resolve and join the game at the current Id.
getGame.$inject = ['$stateParams', 'GameService'];
function getGame($stateParams, GameService) {
  return GameService.getGame($stateParams.gameId);
}
