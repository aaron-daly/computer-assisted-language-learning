var passport = require('passport');

var User = require('../app/models/User');
var Role = require('../app/models/Role');
var Group = require('../app/models/Group');
var Scenario = require('../app/models/Scenario');
var ScenarioType = require('../app/models/ScenarioType');

// app/routes.js
module.exports = function(app) {


    // =========================================================================
    // SCENARIOS ===============================================================

    // POST ScenarioType
    app.post('/scenarioType', function(req, res, next) {

        var scenarioType = new ScenarioType({
            scenarioType: req.body.scenarioType,
            name: req.body.name
        });

        scenarioType.save(function(err) {
            if(err)
                return next(err);
            return next(scenarioType);
        });
    });

    // GET ScenarioTypes
    app.get('/scenarioTypes', function(req, res, next) {

        ScenarioType.find(function(err, scenarioTypes) {
            if(err)
                return next(err);
            res.json(scenarioTypes);
        });
    });

    // POST Scenario
    app.post('/scenario', function(req, res, next) {
        console.log(req.body);

        ScenarioType.findOne({ name: req.body.scenarioType }, function(err, scenarioType) {

            if(err)
                return res.send(err);

            var scenario = new Scenario({
                name: req.body.name,
                level: req.body.level,
                scenarioType: { id: scenarioType._id, name: scenarioType.name },
                conversation: req.body.conversation
            });

            scenario.save(function(err) {
                if(err)
                    return res.send(err);
                return res.json(scenario);
            });
        });
    });

    app.post('/deleteScenarios', function(req, res, next) {

        Scenario.remove({}, function(err, scenarios) {
            if(err)
                return res.send(err);
            return res.json(scenarios);
        });

    });

    // GET all Scenarios
    app.get('/scenarios', function(req, res, next) {

        Scenario.find(function(err, scenarios) {
            if(err)
                return next(err);
            return res.json(scenarios);
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

                    return res.json({ token: user.generateJWT(), user: user });

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

    app.post('/user/remove', function(req, res, next) {

        User.remove({ _id: req.body._id }, function(err, user) {
            if(err)
                return res.send(err);
            return res.json(user);
        })
    });

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
            teacherId: req.body.teacherId
        });

        group.save(function(err) {
            if(err)
                return res.send(err);
            return next(group);
        });
    });


    app.post('/group/byTeacherId', function(req, res, next) {

        Group.findOne({ teacherId: req.body.teacherId }, function(err, group) {
            if(err)
                return res.send(err);
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

    app.put('/group/scenario/delete', function(req, res, next) {

        console.log(req.body);

        Group.findOneAndUpdate({ teacherId: req.body.teacherId },
            {
                $pull: { "scenarios": {
                    _id: req.body._id
                }}
            }, function(err, group) {
                if(err)
                    return res.send(err);
                return res.json(group);
            });

    });

    app.put('/group/scenario/add', function(req, res, next) {

        console.log(req.body);

        Group.findOneAndUpdate({ teacherId: req.body.teacherId },
            {
                $push: { "scenarios": {
                    scenarioId: req.body.scenarioId,
                    scenarioName: req.body.scenarioName,
                    scenarioType: req.body.scenarioType,
                    scenarioLevel: req.body.scenarioLevel,
                    translations: req.body.translations,
                    enabled: req.body.enabled,
                    completionList: []
                }}
            },
            {
                safe: true,
                upsert: true,
                new: true
            },function(err, group) {
                if(err)
                    res.send(err);
                else res.json(group);
            });

    });

    //PUT to a class
    app.put('/group/scenario/enable', function(req, res, next) {

        Group.findOneAndUpdate({
            teacherId: req.body.teacherId,
            'scenarios.scenarioId': req.body.scenarioId
        },{
            '$set': {
                'scenarios.$.enabled': req.body.enabled
            }
        }, function(err, group) {
            if(err)
                return res.send(err);
            return res.json(group);
        });
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


    // FILE TRANSFER =========================================================


    // =======================================================================

    // =======================================================================
    // FINAL ROUTE TO INDEX.HTML =============================================
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
};
