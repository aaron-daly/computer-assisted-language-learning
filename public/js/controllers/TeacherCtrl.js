/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('TeacherCtrl', []).controller('TeacherController', ['$scope', '$http', '$location', '$route', 'token', 'scenario', 'teacher',
    function($scope, $http, $location, $route, token, scenario, teacher) {

        $scope.username = token.currentUser();
        $scope.role = {};

        token.currentUserRole(function(role) {
            $scope.role = role;
        });

        $scope.pupils = teacher.pupils;
        $scope.selectedPupil = '';

        $scope.groupScenarios = teacher.group.scenarios;

        $scope.allScenarios = [];



        $.each(scenarioGame.scenarioList, function(key, val) {
            val.type = 's'; //append type since the scenario type is not stored in the database
            $scope.allScenarios.push(val);
        });

        $scope.enabledList = [];
        $.each($scope.groupScenarios, function(key, val) {
            if(val.enabled) {
                $scope.enabledList.push(val.scenarioName);
            }
        });

        $scope.isEnabled = function(scenario) {
            return $scope.enabledList.indexOf(scenario.name) > -1;
        };

        $scope.enableScenario = function(scenario) {
            teacher.enableScenario(scenario);
            $route.reload();
        };

        $scope.disableScenario = function(scenario) {
            teacher.disableScenario(scenario);
            $route.reload();
        };

        $scope.batchRegister = function() {
            var names = $scope.batchPupilNames.replace(' ', '').split('\n');

            $.each(names, function(key, name) {
                teacher.registerPupil(name);
            });
            $route.reload();
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
        }
    }
]);