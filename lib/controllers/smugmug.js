'use strict';

var mongoose = require('mongoose'),
  qs = require('querystring'),
  request = require('request'),
  _ = require('lodash'),
  User = mongoose.model('User');

// load the auth variables
var configAuth = require('../config/auth');

var baseURL = "http://api.smugmug.com/services/api/json/1.3.0/?";

// Get Albums
exports.albums = function (req, res) {
  //store master res for callback reference
  var masterRes = res;
  var currentUser = req.user;

  //container for data
  var albums = [];

  //vars passed to request method for authenticated http request
  var oauth = {
    consumer_key : configAuth.smugmugAuth.consumerKey,
    consumer_secret: configAuth.smugmugAuth.consumerSecret,
    token: currentUser.smugmug.token,
    token_secret: currentUser.smugmug.tokenSecret
  };

  //set up parameter arguments and add to url
  //heavy returns more data from smugmug
  var params = {
    method: "smugmug.albums.get",
    Heavy: true
  };

  var getAlbumURL = baseURL + qs.stringify(params);

  //setup complete, let's fetch the albums
  request.get({ url: getAlbumURL, oauth: oauth, json: true }, function (e, r, res) {
    console.log("Retrieved Albums");
    console.log(res);
    var Albums = res.Albums;
    var i, ImageID, ImageKey, getImageInfoURL, reqCount = 0;

    //retrieve each album's highlight photo
    for (i = 0; i < Albums.length; i++) {
      ImageID = Albums[i].Highlight.id;
      ImageKey = Albums[i].Highlight.Key;

      params = {
        method: "smugmug.images.getInfo",
        ImageID: ImageID,
        ImageKey: ImageKey
      };

      getImageInfoURL = baseURL + qs.stringify(params);

      request.get({ url: getImageInfoURL, oauth: oauth, json: true }, gotImageInfo);
    }

    function gotImageInfo(e, r, res) {
      reqCount += 1;

      var Image = res.Image;
      //res.Image is target

      var album = _.find(Albums, function(Album) {
        return Album.id === Image.Album.id;
      });

      album.HighlightURL = Image.MediumURL;

      console.log(album.HighlightURL);

      if(reqCount === Albums.length) {
        return masterRes.json(Albums);
      }
    }



  });
}

/**
 * Get images
 */
exports.images = function(req, res) {
  var masterRes = res;
  var currentUser = req.user;

  var images = [];

  var oauth = {
    consumer_key : configAuth.smugmugAuth.consumerKey,
    consumer_secret: configAuth.smugmugAuth.consumerSecret,
    token: currentUser.smugmug.token,
    token_secret: currentUser.smugmug.tokenSecret
  };

  var baseURL = "http://api.smugmug.com/services/api/json/1.3.0/?";

  var inParams = qs.parse(req.url.split("?")[1]);

  var params = {
    method: "smugmug.images.get",
    AlbumID: inParams.albumID,
    AlbumKey: inParams.albumKey,
    Heavy: true
  };

  var getImagesURL = baseURL + qs.stringify(params);

  request.get({ url: getImagesURL, oauth: oauth, json: true }, function (e, r, res) {
    var albumImages = res.Album.Images;
    return masterRes.json(albumImages);
  });
};

//get selections
exports.selections = function (req, res) {
  // body...
  var userId = req.user._id.toHexString();
  var currentUser = req.user;

  User.findById(userId, function (err, user) {
    res.send(user.selections);
  });

};