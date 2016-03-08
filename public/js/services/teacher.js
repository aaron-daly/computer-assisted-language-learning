angular.module('calliApp')

    .factory('teacher', ['$http', 'token', 'auth',
        function($http, token, auth) {

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

            teacher.enableScenario = function(scenario) {

                $http.put('/group/scenario', {
                    teacherId: token.currentUserId(),
                    scenarioId: scenario._id,
                    scenarioName: scenario.name,
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

            teacher.logScenarioCompletion = function(scenario, pupil) {

                $http.put('/group/scenario/completion', {
                    teacherId: token.currentUserCreator(),
                    scenarioId: scenario._id,
                    pupilId: pupil._id
                    }
                )
                    .error(function(error) {
                        console.log(data);
                    });
            };

            return teacher;
        }
    ]);
