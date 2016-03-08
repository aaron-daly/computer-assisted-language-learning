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

        $scope.scenarios = teacher.group.scenarios;

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

        //append buttons for scenarios to play
        $.each($scope.scenarios, function(key, scenario) {
            if(scenario.enabled) {
                var btn = '<button class="btn btn-info scenario-btn" value="c">' + scenario.scenarioName + '</button>';
                $('#scenario-container').append(btn);
            }
        });


        //listen for scenario-btn click
        $('.scenario-btn').on('click', function() {
            if($(this).val() === 'c') {
                $location.path('/conversationGame/:' + $(this).text());
            }
            $scope.$apply();
        });

    }
]);