'use strict';

// Setting up route
angular.module('game').config(['$stateProvider',
  function ($stateProvider) {
    // game state routing
    $stateProvider
      .state('game', {
        url: '/newgame',
        templateUrl: 'modules/blackjack/views/newgame.client.view.html',
        controller: 'NewGameController',
        controllerAs: 'vm'
      })
      .state('game_inprogress', {
        url: '/game/:gameId',
        templateUrl: 'modules/blackjack/views/game.client.view.html',
        controller: 'GameController',
        controllerAs: 'vm',
        resolve: {
          currentGame: joinGame
        }
      })
      .state('game_stats', {
        url: '/game/:gameId/stats',
        templateUrl: 'modules/blackjack/views/game.stats.client.view.html',
        controller: 'GameStatsController',
        controllerAs: 'vm',
        resolve: {
          gameStats: gameStats
        }
      });
  }
]);

gameStats.$inject = ['$stateParams', 'GameService'];
function gameStats($stateParams, GameService) {
  return GameService.getStats($stateParams.gameId);
}

joinGame.$inject = ['$stateParams', 'GameService'];
function joinGame($stateParams, GameService) {
  return GameService.joinGame($stateParams.gameId);
}
