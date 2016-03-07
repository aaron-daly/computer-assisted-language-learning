/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('TeacherCtrl', []).controller('TeacherController', ['$scope', '$http', '$location', '$route', 'token', 'teacher', 'conversationGame',
    function($scope, $http, $location, $route, token, teacher, conversationGame) {

        $scope.username = token.currentUser();

        $scope.pupils = teacher.pupils;
        $scope.selectedPupil = '';

        $scope.groupScenarios = teacher.group.scenarios;

        $scope.allScenarios = [];
        $.each(conversationGame.scenarioList, function(key, val) {
            $scope.allScenarios.push(val);
        }); /* UNCOMMENT WHEN PICTURE AND WORD GAMES DONE
        $.each(pictureGame.scenarioList, function(key, val) {
            $scope.allScenarios.push(val);
        });
        $.each(wordGame.scenarioList, function(key, val) {
            $scope.allScenarios.push(val);
        }); */


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
                return scenario.completionList.indexOf(pupil._id > 0);
            }
        }
    }
]);