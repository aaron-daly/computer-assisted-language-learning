var passport = require('passport');

// app/routes.js
module.exports = function(app) {


    // REGISTER
    app.post('/register', passport.authenticate('register', {
        successRedirect: '/profile',
        failureRedirect: '/register'
    }));

    //LOGIN
    app.post('/login', passport.authenticate('login', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    }));

    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });
};
