'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    smugmug = require('./controllers/smugmug'),
    slideshows = require('./controllers/slideshows'),
    passport = require('passport');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);

  // SmugMug API Access
  app.get('/api/smugmug/albums', smugmug.albums);
  app.get('/api/smugmug/images', smugmug.images);
  app.get('/api/smugmug/selections', smugmug.selections);

  app.post('/api/slideshows/selections', slideshows.selections);
  
  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/session', session.login);-
  app.del('/api/session', session.logout);

  // SmugMug API Routes
  app.get('/auth/smugmug', 
    passport.authenticate('smugmug'),
      function(req, res) {
        console.log("in smugmug success");
      }
  );

  app.get('/auth/smugmug/callback', 
    passport.authenticate('smugmug', 
      {
        failureRedirect: '/login' 
      }), 
      function(req, res) {
        console.log("in smugmug callback success method");
        res.redirect('/');
      });


  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};