/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('NavigationCtrl', []).controller('NavigationController', ['$scope', '$q', '$location', 'auth', 'token',
    function($scope, $q, $location, auth, token) {

        $scope.authorized = "";

        $scope.isLoggedIn = function() {
            return token.isLoggedIn();
        };

        $scope.logout = function() {
            auth.logout();
        };

        $scope.directToProfile = function() {
            var defer = $q.defer();

            token.currentUserRole(function(role) {
                if(role === 'pupil' || role === 'student') {
                    $location.path('/profile');
                    defer.resolve('pupil/student');
                } else {
                    $location.path('/teacher');
                    defer.resolve('teacher');
                }
            });

            return defer.promise;
        }
    }
]);