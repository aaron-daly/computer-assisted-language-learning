// public/js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$location', 'auth',
    function($scope, $location, auth) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.loginErrorMessage = '';

        $scope.login = function() {
            auth.login({
                username: $scope.username,
                password: $scope.password
            }, function(error) {
                if(error) {
                    $scope.displayError(error.message);
                }
            });

        };

        $scope.displayError = function(error) {
            $('#error-message').empty().append(error);
        };
    }
]);