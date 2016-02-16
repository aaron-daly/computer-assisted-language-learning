// public/js/controllers/PreviewCtrl.js
angular.module('PreviewCtrl', []).controller('PreviewController', ['$scope',
    function($scope) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.questions = [];
        
    }
]);