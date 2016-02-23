var passport = require('passport');

// app/routes.js
module.exports = function(app) {


    // REGISTER
    app.post('/register', function(req, res, next) {

        console.log('register route for ' + req.body.username);

        if(!req.body.username || !req.body.password) {
            return res.status(400).json({ message: 'All fields must be filled out'});
        }

        console.log('ready for authentication ' + req.body.username);

        passport.authenticate('register', function(err, user, info) {
            console.log('authenticated ' + user);
            if(err) {
                return next(err);
            }
            if(user) {
                return res.json({ token: user.generateJWT() });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });

    //LOGIN
    app.post('/login', function(req, res, next) {

        console.log('login route for ' + req.body.username);

        if(!req.body.username || !req.body.password) {
            return res.status(400).json({ message: 'All fields must be filled out'});
        }

        console.log('ready for authentication ' + req.body.username);

        passport.authenticate('login', function(err, user, info) {
            console.log('authenticated ' + user);
            if(err) {
                return next(err);
            }
            if(user) {
                return res.json({ token: user.generateJWT() });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });

    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });
};
