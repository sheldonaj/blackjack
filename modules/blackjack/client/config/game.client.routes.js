'use strict';

// Setting up route
angular.module('game').config(['$stateProvider',
  function ($stateProvider) {
    // game state routing
    $stateProvider
      .state('game', {
        url: '/game',
        templateUrl: 'modules/blackjack/views/game.client.view.html',
        controller: 'GameController',
        controllerAs: 'vm',
        resolve: {
          currentGame: currentGame
        }
      })
      .state('game_stats', {
        url: '/stats',
        templateUrl: 'modules/blackjack/views/game.stats.client.view.html',
        controller: 'GameStatsController',
        controllerAs: 'vm',
        resolve: {
          gameStats: gameStats
        }
      });
  }
]);

currentGame.$inject = ['GameService'];
function currentGame(GameService) {
  return GameService.joinGame();
}

gameStats.$inject = ['GameService'];
function gameStats(GameService) {
  return GameService.getStats();
}
