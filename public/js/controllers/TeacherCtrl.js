
angular.module('TeacherCtrl', []).controller('TeacherController', ['$scope', '$http', '$location', '$route', 'token', 'auth', 'scenario', 'teacher', 'scenarioGame',
    function($scope, $http, $location, $route, token, auth, scenario, teacher, scenarioGame) {

        $scope.username = token.currentUser();
        $scope.pupils = teacher.pupils;
        $scope.selectedPupil = '';
        $scope.groupScenarios = teacher.group.scenarios;

        // logout using auth.logout()
        $scope.logout = function() {
            auth.logout();
        };

        // check if scenario is enabled
        $scope.isEnabled = function(scenario) {
            return scenario.enabled;
        };

        // check if scenario contains translations
        $scope.containsTranslations = function(scenario) {
            return scenario.containsTranslations;
        };

        // check if scenario has translations enabled
        $scope.translationsEnabled = function(scenario) {
            if(scenario.translations) {
                return scenario.translations;
            }
            return false;
        };

        // enable scenario
        $scope.enableScenario = function(scenario) {
            teacher.enableScenario(scenario);
            scenario.enabled = true;
        };

        // disable scenario
        $scope.disableScenario = function(scenario) {
            teacher.disableScenario(scenario);
            scenario.enabled = false;
        };

        // delete scenario
        $scope.deleteScenario = function(scenario) {
            teacher.deleteScenario(scenario);
            $scope.groupScenarios.splice($scope.groupScenarios.indexOf(scenario), 1);
        };

        // enable scenario translations
        $scope.enableTranslations = function(scenario) {
            teacher.enableTranslations(scenario);
            scenario.translations = true;
        };

        // disable scenario translations
        $scope.disableTranslations = function(scenario) {
            teacher.disableTranslations(scenario);
            scenario.translations = false;
        };

        // preview scenario, direct to /scenarioGame view
        $scope.previewScenario = function(scenario) {
            $location.path('/scenarioGame/:' + scenario.scenarioName);
        };

        // batch register pupils
        $scope.batchRegister = function() {

            $scope.successfulRegistration = false;
            $scope.registrationError = false;
            $scope.registrationErrorMessage = "Oops, there was a problem registering - ";

            var names = $scope.batchPupilNames.replace(' ', '').split('\n');

            // For each pupil name entered......
            // register with teacher.registerPupil()
            // if response contains user, add new pupil to $scope.pupils
            // else show error
            $.each(names, function(key, name) {
                teacher.registerPupil(name, function(response) {
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

        // clear pupil registration textfield
        $scope.clearRegistration = function() {
            $('#batch-register-form')[0].reset();
            $scope.successfulRegistration = false;
            $scope.registrationError = false;
            $scope.registrationErrorMessage = "Oops, there was a problem registering - ";
        };

        // remove pupil using teacher.removePupil()
        $scope.removePupil = function(pupil) {
            teacher.removePupil(pupil);
            $scope.pupils.splice($scope.pupils.indexOf(pupil), 1);
        };

        // toggle a pupil for the pupil progress modal
        $scope.togglePupil = function(pupil) {
            $scope.selectedPupil = pupil;
        };

        // check if a scenario has been completed by a pupil
        $scope.checkScenarioCompletion = function(pupil, scenario) {
            if(!scenario.completionList) {
                return false;
            } else {
                return scenario.completionList.indexOf(pupil._id) > -1;
            }
        };

        // get total number of scenarios completed by a pupil
        $scope.getScenarioCompletionTotal = function(pupil) {
            var count = 0;
            $.each($scope.groupScenarios, function(key, val) {
                if($scope.checkScenarioCompletion(pupil, val)) {
                    count++;
                }
            });
            return count;
        };

        // get total number of scenarios in the group
        $scope.getNumScenarios = function() {
            if($scope.groupScenarios) {
                return $scope.groupScenarios.length;
            }
            return 0;
        };

        // get the rank of a pupil
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

        // route to the add scenario page
        $scope.routeToAddScenario = function() {
            $location.path('/addScenario');
        };
    }
]);