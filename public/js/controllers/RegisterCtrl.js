// public/js/controllers/RegisterCtrl.js
angular.module('RegisterCtrl', []).controller('RegisterController', ['$scope', 'auth',
    function($scope, auth) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.register = function() {
            auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            });
        };

    }
]);