var passport = require('passport');

var User = require('../app/models/User');
var Role = require('../app/models/Role');
var Group = require('../app/models/Group');

var ConversationScenario = require('../app/models/ConversationScenario');
var PictureScenario = require('../app/models/PictureScenario');
var WordScenario = require('../app/models/WordScenario');


// app/routes.js
module.exports = function(app) {


    // =========================================================================
    // SCENARIOS ===============================================================

    // POST scenario type C
    app.post('/scenario/add/c', function(req, res, next) {

        var cS = new ConversationScenario({
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

    // POST scenario type P
    app.post('/scenario/add/p', function(req, res, next) {

        var pS = new PictureScenario({
            name: req.body.name,
            level: req.body.level,
            conversation: req.body.questions
        });

        pS.save(function(err) {
            if(err)
                throw err;
            return next(pS);
        });
    });

    // POST scenario type w
    app.post('/scenario/add/w', function(req, res, next) {

        var wS = new WordScenario({
            name: req.body.name,
            level: req.body.level,
            conversation: req.body.questions
        });

        wS.save(function(err) {
            if(err)
                throw err;
            return next(wS);
        });
    });


    // GET all conversation scenarios, callback array
    app.get('/conversationScenarios', function(req, res, next) {

        var scenarios = [];
        var i = 0;
        var len = 0;

        ConversationScenario.find(function(err, cS) {
            if (err)
                throw err;

            len = cS.length;
            for(i; i < len; i++) {
                scenarios.push(cS[i]);
            }

            res.json(scenarios);    //remove once other scenario types added
        });

    });

    // GET all picture scenarios, callback array
    app.get('/pictureScenarios', function(req, res, next) {

        var scenarios = [];
        var i = 0;
        var len = 0;

        PictureScenario.find(function(err, cS) {
            if (err)
                throw err;

            len = cS.length;
            for(i; i < len; i++) {
                scenarios.push(cS[i]);
            }

            res.json(scenarios);    //remove once other scenario types added
        });

    });

    // GET all word scenarios, callback array
    app.get('/wordScenarios', function(req, res, next) {

        var scenarios = [];
        var i = 0;
        var len = 0;

        WordScenario.find(function(err, cS) {
            if (err)
                throw err;

            len = cS.length;
            for(i; i < len; i++) {
                scenarios.push(cS[i]);
            }

            res.json(scenarios);    //remove once other scenario types added
        });

    });



    // END OF SCENARIOS ========================================================
    // =========================================================================


    // =========================================================================
    // USERS ===================================================================

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

                    user.setRole(role);
                    if(req.body.creator) {
                        user.setCreator(req.body.creator);
                    }

                    user.save(function(err) {
                        if(err)
                            throw err;
                    });

                    return res.json({ token: user.generateJWT() });

                });

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


    //POST to login user
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

    //POST a role
    app.post('/role', function(req, res, next) {

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

    //POST for a role by id
    app.post('/role/id', function(req, res, next) {

        Role.findOne({ _id: req.body.roleId }, function(err, role) {
            if(err)
                throw err;
            res.json(role);
        })
    });

    //GET all users
    app.get('/users', function(req, res, next) {
        User.find(function(err, users) {
            if(err)
                throw err;
            res.json(users);
        })
    });

    //POST for a user by username
    app.post('/user', function(req, res, next) {
        User.findOne({ username: req.body.username }, function(err, user) {
            if(err)
                throw err;
            res.json(user);
        })
    });

    //GET all roles
    app.get('/roles', function(req, res, next) {
        Role.find(function(err, roles) {
            if(err)
                throw err;
            res.json(roles);
        })
    });


    //POST for all pupils of a teacher by teacherId
    app.post('/pupils', function(req, res, next) {
        User.find({ creator: req.body.teacherId }, function(err, pupils) {
            if(err)
                throw err;
            res.json(pupils);
        })
    });


    // END OF USERS ==========================================================
    // =======================================================================


    // TEACHER CLASSES =======================================================
    // =======================================================================

    //POST a group
    app.post('/group', function(req, res, next) {

        var group = new Group({
            teacherId: req.body.teacherId,
        });

        group.save(function(err) {
            if(err)
                throw err;
            return next(group);
        });
    });


    app.post('/group/byTeacherId', function(req, res, next) {

        Group.findOne({ teacherId: req.body.teacherId }, function(err, group) {
            if(err)
                throw err;
            else res.json(group);
        })
    });


    app.get('/groups', function(req, res, next) {
        Group.find(function(err, groups) {
            if(err)
                throw err;
            res.json(groups);
        })
    });

    //PUT to a class
    app.put('/group/scenario', function(req, res, next) {

        Group.findOneAndUpdate({
            teacherId: req.body.teacherId,
            'scenarios.scenarioId': req.body.scenarioId
        },{
            '$set': {
                'scenarios.$.enabled': req.body.enabled
            }
        }, function(err, group) {
            if(err)
                throw err;
            if(!group) {
                console.log(req.body);
                Group.findOneAndUpdate({ teacherId: req.body.teacherId },
                    {
                        $push: { "scenarios": {
                            scenarioId: req.body.scenarioId,
                            scenarioName: req.body.scenarioName,
                            scenarioType: req.body.scenarioType,
                            enabled: true
                        }}
                    },
                    {
                        safe: true,
                        upsert: true,
                        new: true
                    }, function(err, group2) {
                        if(err)
                            throw(err);
                        else res.json(group2);
                    })
            } else {
                res.json(group);
            }
        })
    });


    app.put('/group/scenario/completion', function(req, res, next) {

        Group.findOneAndUpdate({
            teacherId: req.body.teacherId,
            'scenarios.scenarioId': req.body.scenarioId
        },{
            '$push': {
                'scenarios.$.completionList': req.body.pupilId
            }
        },{
            safe: true,
            upsert: true,
            new: true
        },
            function(err, group) {
            if(err)
                throw err;
            res.json(group);
        })
    });


    //PUT to a class
    app.put('/group/scenarioEnable', function(req, res, next) {

        Group.findOneAndUpdate({ teacherId: req.body.teacherId },
            {
                $push: { "scenarios": {
                    scenarioId: req.body.scenarioId,
                    scenarioName: req.body.scenarioName,
                    enabled: req.body.enabled
                }}
            },
            {
                safe: true,
                upsert: true,
                new: true
            }, function(err, group) {
                if(err)
                    throw(err);
                else res.json(group);
            })
    });




    // END OF TEACHER CLASSES ================================================
    // =======================================================================



    // =======================================================================
    // FINAL ROUTE TO INDEX.HTML =============================================
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
};
