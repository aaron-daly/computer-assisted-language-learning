
angular.module('TeacherCtrl', []).controller('TeacherController', ['$scope', '$http', '$location', '$route', 'token', 'auth', 'scenario', 'teacher', 'scenarioGame',
    function($scope, $http, $location, $route, token, auth, scenario, teacher, scenarioGame) {

        $scope.username = token.currentUser();
        $scope.role = {};

        token.currentUserRole(function(role) {
            $scope.role = role;
        });

        $scope.pupils = teacher.pupils;
        $scope.selectedPupil = '';

        $scope.groupScenarios = teacher.group.scenarios;

        $scope.logout = function() {
            auth.logout();
        };

        $scope.isEnabled = function(scenario) {
            return scenario.enabled;
        };

        $scope.translationsEnabled = function(scenario) {
            if(scenario.translations) {
                return scenario.translations;
            }
            return false;
        };

        $scope.enableScenario = function(scenario) {
            teacher.enableScenario(scenario);
            scenario.enabled = true;
        };

        $scope.disableScenario = function(scenario) {
            teacher.disableScenario(scenario);
            scenario.enabled = false;
        };

        $scope.deleteScenario = function(scenario) {
            teacher.deleteScenario(scenario);
            $scope.groupScenarios.splice($scope.groupScenarios.indexOf(scenario), 1);
        };

        $scope.enableTranslations = function(scenario) {
            teacher.enableTranslations(scenario);
            scenario.translations = true;
        };

        $scope.disableTranslations = function(scenario) {
            teacher.disableTranslations(scenario);
            scenario.translations = false;
        };

        $scope.previewScenario = function(scenario) {
            $location.path('/scenarioGame/:' + scenario.scenarioName);
        };


        $scope.batchRegister = function() {

            $scope.successfulRegistration = false;
            $scope.registrationError = false;
            $scope.registrationErrorMessage = "Oops, there was a problem registering - ";

            var names = $scope.batchPupilNames.replace(' ', '').split('\n');
            var isError = false;

            $.each(names, function(key, name) {
                teacher.registerPupil(name, function(response) {
                    console.log(response);
                    if(response.user) {
                        $scope.pupils.push(response.user);
                    } else {
                        $scope.registrationError = true;
                        $scope.registrationErrorMessage += name;
                        if(key < names.length-1) {
                            $scope.registrationErrorMessage += ', ';
                        }
                    }
                });
            });

            $scope.successfulRegistration = true;
        };

        $scope.clearRegistration = function() {
            $('#batch-register-form')[0].reset();
            $scope.successfulRegistration = false;
            $scope.registrationError = false;
            $scope.registrationErrorMessage = "Oops, there was a problem registering - ";
        };

        $scope.removePupil = function(pupil) {
            teacher.removePupil(pupil);
            $scope.pupils.splice($scope.pupils.indexOf(pupil), 1);
        };

        $scope.togglePupil = function(pupil) {
            $scope.selectedPupil = pupil;
        };

        $scope.checkScenarioCompletion = function(pupil, scenario) {
            if(!scenario.completionList) {
                return false;
            } else {
                return scenario.completionList.indexOf(pupil._id) > -1;
            }
        };

        $scope.getScenarioCompletionTotal = function(pupil) {
            var count = 0;
            $.each($scope.groupScenarios, function(key, val) {
                if($scope.checkScenarioCompletion(pupil, val)) {
                    count++;
                }
            });
            return count;
        };

        $scope.getNumScenarios = function() {
            if($scope.groupScenarios) {
                return $scope.groupScenarios.length;
            }
            return 0;
        };

        $scope.getScenarioCompletionRank = function(pupil) {
            var numScenarios = $scope.getNumScenarios().toFixed(1);
            var completionTotal = $scope.getScenarioCompletionTotal(pupil).toFixed(1);
            var completionPerc = completionTotal / numScenarios;

            if(completionTotal == 0 || completionPerc < 0.5) {
                return 3
            } else if(completionPerc < 1) {
                return 2;
            }
            return 1;
        };

            $scope.routeToAddScenario = function() {
            $location.path('/addScenario');
        }
    }
]);