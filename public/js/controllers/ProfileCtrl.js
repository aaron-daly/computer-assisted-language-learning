/**
 * Created by Dalyy on 23/02/2016.
 */

angular.module('ProfileCtrl', []).controller('ProfileController', ['$scope', '$http', '$location', '$route', 'token', 'auth', 'teacher',
    function($scope, $http, $location, $route, token, auth, teacher) {


        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.username = token.currentUser();
        $scope.userId  = token.currentUserId();

        $scope.role = {};

        token.currentUserRole(function(role) {
            $scope.role = role;
        });

        $scope.scenarios = [];

        $scope.playScenario = function(scenario) {
            $location.path('/scenarioGame/:' + scenario.scenarioName);
        };

        $scope.checkScenarioCompletion = function(scenario) {
            if(!scenario.completionList) {
                return false;
            } else {
                return scenario.completionList.indexOf($scope.userId) > -1;
            }
        };

        $scope.completedGames = [];
        $scope.newGames = [];

        $.each(teacher.group.scenarios, function(key, val) {
                if (val.enabled) {
                    $scope.scenarios.push(val);
                    if($scope.checkScenarioCompletion(val)) {
                        $scope.completedGames.push(val);
                    } else {
                        $scope.newGames.push(val);
                    }
                }
            }
        );


    }
]);