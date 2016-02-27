/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('ProfileCtrl', []).controller('ProfileController', ['$scope', '$http', '$location', 'token',
    function($scope, $http, $location, token) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.user = {};
        $scope.role = {};

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

        $scope.goToGame = function() {
            $location.path('/game');
        };

    }
]);