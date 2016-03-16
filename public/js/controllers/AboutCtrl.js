
angular.module('AboutCtrl', []).controller('AboutController', ['$scope', '$location',
    function($scope, $location) {

        // direct to register page
        $scope.directToRegister = function() {
            $location.path('/register');
        }
    }
]);
