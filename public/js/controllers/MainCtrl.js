// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainController', ['$scope', '$location', 'token',
    function($scope, $location, token) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        // route to the register page
        $scope.registerRedirect = function() {
            $location.path('/register');
        };

        // check if user is logged in with token.isLoggedIn()
        $scope.isLoggedIn = function() {
            return token.isLoggedIn();
        }
    }
]);