'use strict';

// new game controller
angular
  .module('game')
  .controller('NewGameController', NewGameController);

NewGameController.$inject = ['$state', 'GameService'];
function NewGameController($state, GameService) {
  var vm = this;
  
  vm.newGame = newGame;

  // when the new game button is clicked, call the create game method of the GameService REST api, then go to the game inprogress state.
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
