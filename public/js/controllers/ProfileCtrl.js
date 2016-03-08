/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('ProfileCtrl', []).controller('ProfileController', ['$scope', '$http', '$location', '$route', 'token', 'auth', 'conversationGame', 'teacher',
    function($scope, $http, $location, $route, token, auth, conversationGame, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.user = {};
        $scope.role = {};

        $scope.scenarios = [];
        $.each(teacher.group.scenarios, function(key, val) {
                if (val.enabled) {
                    $scope.scenarios.push(val);
                }
            }
        );

            //get current user
        $http.post('/user', { username: token.currentUser() })
            .then(function(data) {

                $scope.user = data.data;
                var roleId = $scope.user.role;

                //with user's role id, get current user's role
                $http.post('/role/id', { roleId:roleId })
                    .then(function(data) {
                        $scope.role = data.data;
                    })

            });

        $scope.playScenario = function(scenario) {
            if(scenario.scenarioType === 'c') {
                $location.path('/conversationGame/:' + scenario.scenarioName);
            }
        };

        $scope.checkScenarioCompletion = function(scenario) {
            if(!scenario.completionList) {
                return false;
            } else {
                return scenario.completionList.indexOf($scope.user._id) > -1;
            }
        }
    }
]);