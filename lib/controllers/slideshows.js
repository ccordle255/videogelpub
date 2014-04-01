'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    qs = require('querystring'),
    request = require('request'),
    _ = require('lodash');

exports.selections = function (req, res, next) {
  var user = req.user;

  var query = { _id: user._doc._id };
  var update = { selections: req.body.selections };
  
  User.update(query, update, function (err, doc) {
    if(!err)
      res.send(doc);
  });
};