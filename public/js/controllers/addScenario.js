
angular.module('AddScenarioCtrl', []).controller('AddScenarioController', ['$scope', '$http',
    function($scope, $http) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.submitScenario = function() {

            console.log(JSON.parse($scope.scenarioJSON));
            var scenarioJSON = JSON.parse($scope.scenarioJSON);


            if(scenarioJSON) {
                $http.post('/scenario/add/' + $scope.type, scenarioJSON, function(response) {
                    console.log(response);
                });
            }
            else {
                //error message for invalid scenario json
            }

        };

        $scope.generatePictureScenarioFrame = function(level) {

            var questionsLength = 5 * level;
            var answersLength = 2;

            if(level > 1) {
                answersLength = 3;
            }

            var q = 1;
            var a = 1;

            for(i; i <= questionsLength; i++) {

            }
        }
    }
]);
