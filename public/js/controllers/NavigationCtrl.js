/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('NavigationCtrl', []).controller('NavigationController', ['$scope', '$q', '$location', 'auth', 'token',
    function($scope, $q, $location, auth, token) {

        $scope.authorized = "";

        // check if user is logged in with token.isLoggedIn()
        $scope.isLoggedIn = function() {
            return token.isLoggedIn();
        };

        // logout user with auth.logout
        $scope.logout = function() {
            auth.logout();
        };

        // route to profile page
        $scope.directToProfile = function() {
            $location.path('/profile');
        };
    }
]);