'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
var authTypes = ['github', 'twitter', 'smugmug', 'google'];

/**
 * Slideshow Schema
 */
var SlideshowSchema = new Schema({
  _creator: Schema.Types.ObjectId,
  images: [],
  selections: []
});

module.exports = mongoose.model('Slideshow', SlideshowSchema);