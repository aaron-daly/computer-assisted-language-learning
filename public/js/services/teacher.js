angular.module('calliApp')

    .factory('teacher', ['$http', 'token', 'auth', 'scenario', 'conversationGame', 'pictureGame', 'wordGame',
        function($http, token, auth, scenario, conversationGame, pictureGame, wordGame) {

            var teacher = {
                pupils: [],
                group: {}
            };

            teacher.registerPupil = function(pupilName) {
                var teacherUsername = token.currentUser();
                var username = teacherUsername + pupilName;
                auth.register({
                    username: username,
                    password: teacherUsername,
                    role: 'pupil',
                    creator: token.currentUserId()
                }, function(error) {
                    console.log(error);
                });
            };

            teacher.getPupils = function () {

                var _teacherId = token.currentUserId();

                $http.post('/pupils', { teacherId: _teacherId })
                    .success(function(data) {
                        angular.copy(data, teacher.pupils);
                        return data;
                    })
                    .error(function(error) {
                        console.log(error);
                    });

            };


            teacher.getGroup = function(_teacherId) {

                $http.post('/group/byTeacherId', { teacherId: _teacherId })
                    .success(function(data) {
                        angular.copy(data, teacher.group);
                        return data;
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            };

            teacher.getScenarioType = function(scenarioName) {
                var type = {};

                if(conversationGame.containsScenario(scenarioName)) {
                    type = 'c';
                } else if(pictureGame.containsScenario(scenarioName)) {
                    type = 'p';
                } else {
                    type = 'w';
                }

                return type;
            };

            teacher.enableScenario = function(scenario) {

                var scenarioType = this.getScenarioType(scenario.name);

                $http.put('/group/scenario', {
                    teacherId: token.currentUserId(),
                    scenarioId: scenario._id,
                    scenarioName: scenario.name,
                    scenarioType: scenarioType,
                    enabled: true
                })
                    .error(function(error) {
                        console.log(error);
                    })
            };

            teacher.disableScenario = function(scenario) {

                $http.put('/group/scenario', {
                        teacherId: token.currentUserId(),
                        scenarioId: scenario._id,
                        scenarioName: scenario.name,
                        enabled: false
                    })
                    .error(function(error) {
                        console.log(error);
                    })
            };

            teacher.logScenarioCompletion = function(scenario) {

                if(teacher.group.scenarios) {
                    $.each(teacher.group.scenarios, function (key, val) {
                        if (val.scenarioName === scenario.name) {

                            if (val.completionList.indexOf(token.currentUserId()) < 0) {
                                $http.put('/group/scenario/completion', {
                                        teacherId: token.currentUserCreator(),
                                        scenarioId: scenario._id,
                                        pupilId: token.currentUserId()
                                    })
                                    .error(function (error) {
                                        console.log(data);
                                    });
                            }
                        }
                    });
                }

            };

            return teacher;
        }
    ]);
