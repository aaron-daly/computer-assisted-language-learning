// public/js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$location', 'auth', 'error',
    function($scope, $location, auth, error) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.loginErrorMessage = '';

        $scope.login = function() {
            auth.login({
                username: $scope.username,
                password: $scope.password
            });
        }
    }
]);