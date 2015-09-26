'use strict';

// Game controller
angular
  .module('game')
  .controller('NewGameController', NewGameController);

NewGameController.$inject = ['$state', 'GameService'];
function NewGameController($state, GameService) {
  var vm = this;
  
  vm.newGame = newGame;

  function newGame() {
    GameService.createGame()
      .then(function(created_game) { 
         $state.go('game_inprogress', {gameId: created_game.id});
      })
      .catch(function(error) {
        console.log('Failed to create a new game');
      });
  }
}
