'use strict';

// Looked at a few different approaches of card shuffling, dealing, deck handling online and liked this idea the best.
// So not my own invention, but card shuffling/dealing really is a solved problem.  

function getRandomInt (max) {
    return Math.floor(Math.random() * (max + 1));
}

function getShuffledPack() {
    var cards = [];
    cards[0] = 0;
    for (var i = 1; i < 52; i++) {
        var j = getRandomInt(i);
        cards[i] = cards[j];
        cards[j] = i;        
    }
    return cards;
}

exports.dealNextCard = function (game) {
    if (game.deckLocation >= game.cards.length) {
        game.cards = getShuffledPack();
        game.deckLocation = 0;
    }
    var cardNumber = game.cards[game.deckLocation];
    game.deckLocation++;
    return cardNumber;
};

exports.getShuffledPack = getShuffledPack;