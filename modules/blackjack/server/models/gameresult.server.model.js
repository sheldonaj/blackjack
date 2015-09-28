'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * GameResult Schema.   Really this should be call HandResult but didn't feel like changing all the names at the end.  
 */
var GameResultSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  player: {
    type: Number,
    required: true
  },
  dealer: {
    type: String,
    required: true
  },
  winner: {
    type: String,
    trim: true,
    required: true
  },
  result: {
    type: String,
    trim: true,
    required: true
  },
});

mongoose.model('GameResult', GameResultSchema);
