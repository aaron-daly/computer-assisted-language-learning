// config/passport.js

var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/User');

module.exports = function(passport) {

    // serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('register', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                //check if user exits
                User.findOne({'username':username}, function(err, user) {

                    if(err)
                        return done(err);

                    // see if username is already being used
                    if (user) {
                        return done(null, false, req.flash('registerMessage', 'That username is already taken.'));
                    } else { //username not already taken

                        var nUser = new User(); //create new user
                        nUser.username = username;
                        nUser.password = nUser.generateHash(password);
                        console.log("user signed up");

                        //save to datavase
                        nUser.save(function(err) {
                            if(err)
                                throw err;
                            return done(null, nUser);
                        });
                    }

                });

            });

        }));

    /* UNREGISTER TO DO------------
    passport.use('unregister', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                //check if user exits
                User.findOne({'username':username}, function(err, user) {

                    if(err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false); //

                    // if the user is found but the password is wrong
                    if (!user.validPassword(password))
                        return done(null, false); // create the loginMessage and save it to session as flashdata

                    // remove user
                    User.remove({ 'username':username }, function(err) {
                        if(err)
                            return done(err);
                    })
                })
                    return done(null);

            });

        }));
    */

    passport.use('login', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            //check if user exists
            User.findOne({ username:username }, function(err, user) {
                if(err)
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

};