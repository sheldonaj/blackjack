'use strict'; 

// Main Game controller
angular
  .module('game')
  .controller('GameController', GameController);

GameController.$inject = ['$state', 'GameService', 'GameHelper', 'currentGame'];
function GameController($state, GameService, GameHelper, currentGame) {
  //vm is the main Game view model.  
  //This controller should be light-weight and only contain methods/properties that need to be bindable for the view. 
  var vm = this;
  // Declare all bindable view model properties at the top so they are easy to see at a glance.
  vm.game = null;

  // Declare all bindable view model methods.  
  vm.hit = hit;
  vm.stand = stand;
  vm.deal = deal;
  vm.newHand = newHand;
  vm.newGame = newGame;
  vm.getStats = getStats;

  activate();

  // If there is a current active game, it is automatically resolved in the routes as the currentGame.  
  function activate() {
    if(currentGame) {
      vm.game = currentGame;
      GameHelper.updateCards(vm.game);
    }
  }

  // Hit, stand, deal, newGame methods just maps the button click in the view to the approriate REST GameService method
  // Error handling is light and debug only. If this was for real it should steer the user to a better not found, server down, etc views.
  function hit() {
    GameService.hit(vm.game.id)
      .then(function(updated_game) {
        vm.game = updated_game; 
        GameHelper.updateCards(vm.game);
      })
      .catch(function(error) {
        console.log('Failed to update game follow hit action.');
      });
  }

  function stand() {
    GameService.stand(vm.game.id)
      .then(function(updated_game) { 
        vm.game = updated_game;
        GameHelper.updateCards(vm.game);
      })
      .catch(function(error) {
        console.log('Failed to update game follow stand action.');
      });
  }

  function deal() {
    GameService.deal(vm.game.id)
      .then(function(updated_game) {
        vm.game = updated_game; 
        GameHelper.updateCards(vm.game);
      })
      .catch(function(error) {
        console.log('Failed to update game follow deal action.');
      });
  }

  function newGame() {
    GameService.createGame()
      .then(function(updated_game) { 
        vm.game = updated_game;
        GameHelper.updateCards(vm.game);
      })
      .catch(function(error) {
        console.log('Failed to create a new game');
      });
  }

  // Clicking get Stats maps to switching to the game_stats view state.
  function getStats() {
    $state.go('game_stats', {gameId: vm.game.id});
  }

  // NewHand is the logic to determine if the Deal button or the Hit, Stand buttons should be enabled. 
  // Is an incomplete hand in progress, or is a new hand ready to be dealt
  function newHand() {
    return (!vm.game.dealer || !vm.game.dealer.cards) || (vm.game.dealer.cards.length > 0 && vm.game.result && vm.game.result !== 'None');
  }
}
