// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainController', ['$scope', '$location',
    function($scope, $location) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.registerRedirect = function() {

            $location.path('/register');
        }
    }
]);