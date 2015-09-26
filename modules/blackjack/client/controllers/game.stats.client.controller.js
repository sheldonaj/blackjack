'use strict';

// Game controller
angular
  .module('game')
  .controller('GameStatsController', GameStatsController);

GameStatsController.$inject = ['$state', '$stateParams', 'gameStats'];
function GameStatsController($state, $stateParams, gameStats) {
  var vm = this;
  vm.stats = gameStats;
  vm.gameId = $stateParams.gameId;
  console.log("GameId is: " + vm.gameId);

  vm.returnToGame = returnToGame;

  function returnToGame() {
    $state.go('game_inprogress', {gameId: vm.gameId});
  }
}
