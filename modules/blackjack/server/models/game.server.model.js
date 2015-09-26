'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Schema
 */
var GameSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  player: {
    cards: [Number]
  },
  dealer: {
    cards: [Number],
    hidden: [Number]
  },
  result: {
    type: String,
    trim: true,
    required: true
  },
  cards: [Number],
  deckLocation: Number
});

mongoose.model('Game', GameSchema);
