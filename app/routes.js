var passport = require('passport');
var User = require('../app/models/User');
var Role = require('../app/models/Role');
var ConversationalScenario = require('../app/models/ConversationalScenario');
var Question = require('../app/models/Question');
var Answer = require('../app/models/Answer');

// app/routes.js
module.exports = function(app) {


    // =========================================================================
    // SCENARIOS ===============================================================

    // add c type scenario (conversational)
    app.post('/scenario/c/add', function(req, res, next) {

        var cS = new ConversationalScenario({
            name: req.body.name,
            level: req.body.level,
            conversation: req.body.questions
        });

        cS.save(function(err) {
            if(err)
                throw err;
            return next(cS);
        });
    });

    // get one scenario of type 'c'
    app.post('/scenario/c', function(req, res, next) {

        ConversationalScenario.findOne({ name: req.body.name }, function(err, cS) {
            if(err)
                throw err;
            res.json(cS);
        })
    });

    // get all scenarios of type 'c'
    app.get('/scenario/c', function(req, res, next) {

        ConversationalScenario.find(function(err, cS) {
            if(err)
                throw err;
            res.json(cS);
        });
    });




    // END OF SCENARIOS ========================================================
    // =========================================================================

    // REGISTER
    app.post('/register', function(req, res, next) {

        if(!req.body.username || !req.body.password) {
            return res.status(400).json({ message: 'All fields must be filled out'});
        }

        passport.authenticate('register', function(err, user, info) {

            if(err) {
                return next(err);
            }
            if(user) {

                Role.findOne({ type: req.body.role }, function(err, role) {
                    if(err)
                        throw err;

                    User.findOne({ username: user.username }, function(err, nUser) {
                        if(err)
                            throw err;
                        nUser.setRole(role);
                        nUser.save(function(err) {
                        })
                    });
                });
                return res.json({ token: user.generateJWT() });

            } else {
                return res.status(401).json({
                    message: 'A user with that username already exists!'
                });
            }
        })(req, res, next);
    });



    /* UNREGISTER -------TO DO
    app.post('/unregister', function(req, res, next) {

        console.log('unregister attempt: ' + user);
        passport.authenticate('unregister', function(err) {

            if(err) {
                return next(err);
            } else {

            }

        })(req, res, next);
    });
    */

    //LOGIN
    app.post('/login', function(req, res, next) {

        if(!req.body.username || !req.body.password) {
            return res.status(400).json({ message: 'All fields must be filled out'});
        }

        passport.authenticate('login', function(err, user) {
            if(err) {
                return next(err);
            }
            if(user) {
                return res.json({ token: user.generateJWT() });
            } else {
                return res.status(401).json({
                    message: 'Your username or password is incorrect.'
                });
            }
        })(req, res, next);
    });

    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    //ADD ROLE
    app.post('/role', function(req, res, next) {

        console.log(req.body.type);
        var role = new Role({
            type: req.body.type,
            permission: req.body.permission
        });

        role.save(function(err) {
            if(err)
                throw err;
            return next(role);
        });
    });

    //GET ROLE BY ID
    app.post('/role/id', function(req, res, next) {

        Role.findOne({ _id: req.body.roleId }, function(err, role) {
            if(err)
                throw err;
            res.json(role);
        })
    });

    app.get('/users', function(req, res, next) {
        User.find(function(err, users) {
            if(err)
                throw err;
            res.json(users);
        })
    });

    app.post('/user', function(req, res, next) {
        User.findOne({ username: req.body.username }, function(err, user) {
            if(err)
                throw err;
            res.json(user);
        })
    });

    app.get('/roles', function(req, res, next) {
        Role.find(function(err, roles) {
            if(err)
                throw err;
            res.json(roles);
        })
    });

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });
};
