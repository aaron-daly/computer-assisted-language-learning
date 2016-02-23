/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('ProfileCtrl', []).controller('ProfileController', ['$scope', 'auth', 'token',
    function($scope, $location, token) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.user = token.currentUser();

    }
]);