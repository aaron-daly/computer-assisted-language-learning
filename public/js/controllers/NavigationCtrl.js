/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('NavigationCtrl', []).controller('NavigationController', ['$scope', 'auth', 'token',
    function($scope, auth, token) {

        $scope.isLoggedIn = function() {
            return token.isLoggedIn();
        };

        $scope.logout = function() {
            auth.logout();
        }
    }
]);