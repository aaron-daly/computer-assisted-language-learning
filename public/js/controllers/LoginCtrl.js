// public/js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$location', 'auth',
    function($scope, $location, auth) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.login = function() {
            console.log('login-control');
            auth.login({
                username: $scope.username,
                password: $scope.password
            });
        }

    }
]);