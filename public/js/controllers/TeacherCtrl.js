
angular.module('TeacherCtrl', []).controller('TeacherController', ['$scope', '$http', '$location', '$route', 'token', 'scenario', 'teacher', 'scenarioGame',
    function($scope, $http, $location, $route, token, scenario, teacher, scenarioGame) {

        $scope.username = token.currentUser();
        $scope.role = {};

        token.currentUserRole(function(role) {
            $scope.role = role;
        });

        $scope.pupils = teacher.pupils;
        $scope.selectedPupil = '';

        $scope.groupScenarios = teacher.group.scenarios;

        $scope.allScenarios = scenarioGame.scenarioList;

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

        $scope.batchRegister = function() {
            var names = $scope.batchPupilNames.replace(' ', '').split('\n');
            var errorMessage = " couldn't be registered!";
            var isError = false;

            $.each(names, function(key, name) {
                teacher.registerPupil(name, function(response) {
                    $scope.pupils.push(response.user);
                });
            });

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

        $scope.routeToAddScenario = function() {
            $location.path('/addScenario');
        }
    }
]);