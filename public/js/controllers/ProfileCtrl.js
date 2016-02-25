/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('ProfileCtrl', []).controller('ProfileController', ['$scope', '$http', 'token',
    function($scope, $http, token) {

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



    }
]);