
angular.module('AddScenarioCtrl', []).controller('AddScenarioController', ['$scope', '$http',
    function($scope, $http) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.submitScenario = function() {

            var scenarioJSON = JSON.parse($scope.scenarioJSON);

            if(scenarioJSON) {
                $http.post('/scenario/add/' + $scope.type, scenarioJSON, function(response) {
                    console.log(response);
                });
            }
            else {
                //error message for invalid scenario json
            }
        }
    }
]);
