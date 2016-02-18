// public/js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginController', ['$scope', '$location', '$http',
    function($scope, $location, $http) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.invalidInput = false;

        $scope.login = function() {
            $scope.invalidInput = false;
            console.log($scope.username, $scope.class);
            $location.path('/user');
        }

    }
]);