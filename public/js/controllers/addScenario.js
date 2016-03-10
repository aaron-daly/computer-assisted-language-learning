
angular.module('AddScenarioCtrl', []).controller('AddScenarioController', ['$scope', '$http',
    function($scope, $http) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.submitConversation = function() {

            var scenarioJSON = JSON.parse($scope.scenarioJSON);

            var scenario = {
                name: $scope.name,
                level: $scope.level,
                scenarioType: $scope.type,
                conversation: scenarioJSON
            };

            console.log(scenario);

            if(scenario) {
                $http.post('/scenario',{
                    name: scenario.name,
                    level: scenario.level,
                    scenarioType: scenario.scenarioType,
                    conversation: scenario.conversation
                })
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            }
            else {//error message for invalid scenario json
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
        };

        $scope.submitPictureScenario = function(level) {

            var questionsLength = 5 * level;
            var answersLength = 2;

            if(level > 1) {
                answersLength = 3;
            }

        }
    }
]);
