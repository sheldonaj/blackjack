'use strict';

// Game stats controller
angular
  .module('game')
  .controller('GameStatsController', GameStatsController);

// The game stats REST endpoint is resolved in the routes, so it is not needed here.  
GameStatsController.$inject = ['$state', '$stateParams', 'gameStats'];
function GameStatsController($state, $stateParams, gameStats) {
  var vm = this;
  vm.stats = gameStats;
  vm.gameId = $stateParams.gameId;

  vm.returnToGame = returnToGame;

  // Return to the current in progress game.  
  function returnToGame() {
    $state.go('game_inprogress', {gameId: vm.gameId});
  }
}
