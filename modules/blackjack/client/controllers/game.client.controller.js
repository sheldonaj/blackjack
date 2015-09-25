'use strict';

// Game controller
angular
  .module('game')
  .controller('GameController', GameController);

GameController.$inject = ['$scope', '$stateParams', '$state', 'GameService', 'currentGame'];
function GameController($scope, $stateParams, $state, GameService, currentGame) {
  var vm = this;
  vm.dealer = null;
  vm.player = null;
  vm.result = null;

  vm.hit = hit;
  vm.stand = stand;
  vm.deal = deal;
  vm.newHand = newHand;
  vm.newGame = newGame;
  vm.getStats = getStats;

  active();

  function active() {
    updateGameState(currentGame);
  }

  function hit() {
    GameService.hit()
      .then(function(updated_game) { 
        updateGameState(updated_game);
      })
      .catch(function(error) {
        console.log("Failed to update game follow hit action.");
      });
  }

  function stand() {
    GameService.stand()
      .then(function(updated_game) { 
        updateGameState(updated_game);
      })
      .catch(function(error) {
        console.log("Failed to update game follow stand action.");
      });
  }

  function deal() {
    GameService.deal()
      .then(function(updated_game) { 
        updateGameState(updated_game);
      })
      .catch(function(error) {
        console.log("Failed to update game follow deal action.");
      });
  }

  function newGame() {
    GameService.createGame()
      .then(function(updated_game) { 
        updateGameState(updated_game);
      })
      .catch(function(error) {
        console.log("Failed to create a new game");
      });
  }

  function getStats() {
    $state.go('game_stats');
  }

  function updateGameState(updated_game) {
    vm.dealer = updated_game.dealer;
    vm.player = updated_game.player;
    vm.result = updated_game.result;

    for(var i = 0; i < vm.dealer.cards.length; i++) {
      vm.dealer.cards[i].suitImage = getCardSuitImage(vm.dealer.cards[i]);
      vm.dealer.cards[i].rank = getCardRank(vm.dealer.cards[i]);
    }

    for(var i = 0; i < vm.player.cards.length; i++) {
      vm.player.cards[i].suitImage = getCardSuitImage(vm.player.cards[i]);
      vm.player.cards[i].rank = getCardRank(vm.player.cards[i]);
    }
  }

  function newHand() {
    return (!vm.dealer || !vm.dealer.cards) || (vm.dealer.cards.length > 0 && vm.result && vm.result !== 'None');
  }

  function getCardSuitImage(card) {
    var image = '/modules/blackjack/img/club.png';
    if (card.suit === 'H') {
        image = '/modules/blackjack/img/heart.png';
    } else if (card.suit === 'S') {
        image = '/modules/blackjack/img/spade.png';
    } else if (card.suit === 'D') {
        image = '/modules/blackjack/img/diamond.png';
    }
    return image;
  }

  function getCardRank(card) {
    if (card.rank === 1) {
        return 'A';
    } else if (card.rank === 11) {
        return 'J';
    } else if (card.rank === 12) {
        return 'Q';
    } else if (card.rank === 13) {
        return 'K';
    }
    return card.rank;
  }
}
