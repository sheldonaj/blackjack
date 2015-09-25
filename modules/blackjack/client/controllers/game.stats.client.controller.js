'use strict';

// Game controller
angular
  .module('game')
  .controller('GameStatsController', GameStatsController);

GameStatsController.$inject = ['$state', 'gameStats'];
function GameStatsController($state, gameStats) {
  var vm = this;
  vm.stats = gameStats;

  vm.returnToGame = returnToGame;

  function returnToGame() {
    $state.go('game');
  }
}
