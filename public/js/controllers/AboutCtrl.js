
angular.module('AboutCtrl', []).controller('AboutController', ['$scope', '$location',
    function($scope, $location) {

        $scope.directToRegister = function() {
            $location.path('/register');
        }
    }
]);
