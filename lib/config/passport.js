'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    SmugMugStrategy = require('passport-smugmug').Strategy,
    qs = require('querystring'),
    request = require('request');

// load the auth variables
var configAuth = require('./auth');

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});

// add other strategies for more authentication flexibility
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
     // this is the virtual field on the model
  },
  function(req, email, password, done) {
     // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

        // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

        // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

      });
  }
));

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

        // if no user is found, return the message
        if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
    });

}));

// =========================================================================
// SMUGMUG ================================================================
// =========================================================================
passport.use(new SmugMugStrategy({

    // pull in our app id and secret from our auth.js file
    consumerKey        : configAuth.smugmugAuth.consumerKey,
    consumerSecret    : configAuth.smugmugAuth.consumerSecret,
    callbackURL     : configAuth.smugmugAuth.callbackURL,
    passReqToCallback : true

},

// smugmug will send back the token and profile
function(req, token, tokenSecret, profile, done) {
  process.nextTick(function() {
    console.log(profile._json);
    
    var oauth = {
      consumer_key : configAuth.smugmugAuth.consumerKey,
      consumer_secret: configAuth.smugmugAuth.consumerSecret,
      token: token,
      token_secret: tokenSecret
    };

    var url = "http://api.smugmug.com/services/api/json/1.3.0/?";

    var params = {
      method: "smugmug.albums.get"
    };

    url += qs.stringify(params);

    request.get({ url: url, oauth: oauth, json: true }, function (e, r, user) {
      console.log("request came back");
      console.log(user);
    });

    User.findOne({ 'smugmug.id' : profile.id }, function(err, user) {
      // if there is an error, stop everything and return that
      // ie an error connecting to the database
      if (err)
          return done(err);

      // if the user is found then log them in
      if (user) {
          console.log("user: " + user);
          return done(null, user); // user found, return that user
      } else {
          console.log("no user found");
          // if there is no user, create them
          var newUser                 = new User();

          // set all of the user data that we need
          newUser.smugmug.id          = profile.id;
          newUser.smugmug.token       = token;
          newUser.smugmug.tokenSecret = tokenSecret;
          newUser.smugmug.username    = profile.username;
          newUser.smugmug.displayName = profile.displayName;
          newUser.provider            = "smugmug";

          // save our user into the database
          newUser.save(function(err) {
              if (err)
                  throw err;
              return done(null, newUser);
          });
      }
    });
  });
}));

module.exports = passport;