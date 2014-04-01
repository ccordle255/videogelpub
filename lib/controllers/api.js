'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'), 
    qs = require('querystring'),
    request = require('request');

// load the auth variables
var configAuth = require('../config/auth');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};