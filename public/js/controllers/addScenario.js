
angular.module('AddScenarioCtrl', []).controller('AddScenarioController', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.buildQuestionsForm = function() {

            var questionsSize = 5 * $scope.level;
            var answersSize = 2;
            if($scope.level > 1) answersSize++;

            $('#questions-container').empty();

            for(var i = 1; i <= questionsSize; i++) {

                $('#questions-container').append(
                    '<hr><div class="form-group"><label>Question '+i+'</label><input class="form-control" type="text" name="q'+i+'"></div>'
                );

                for(var j = 1; j <= answersSize; j++) {
                    $('#questions-container').append(
                        '<div class="form-group"><label>Q'+i+' Answer '+j+'</label>' +
                        ' <input type="radio" name="q'+i+'correct" value="'+j+'">' +
                        '<input class="form-control" type="text" name="q'+i+'a'+j+'"></div>'
                    )
                }
            }
        };

        $scope.submitScenario = function() {

            var questionsSize = 5 * $scope.level;
            var answersSize = 2;

            if($scope.level > 1) {
                answersSize++;
            }

            var scenario = {
                name: $scope.name,
                level: $scope.level,
                scenarioType: $scope.type
            };

            var answer = {};

            var questions = [];

            for(var i = 1; i <= questionsSize; i++){
                var question = {};
                question.question = $('input[name=q'+i+']').val();
                question.answers = [];

                if(!question.question) {
                    break;
                }

                for(var j = 1; j <= answersSize; j++) {
                    answer = {};
                    answer.answer = $('input[name=q'+i+'a'+j+']').val();
                    if($scope.type != 'Conversation') {
                        console.log($('input[name='+'q'+i+'correct').val(), j);
                        if($('input[name=' + 'q'+i+'correct]').val() == j) {
                            answer.correct = true;
                        } else {
                            answer.correct = false;
                        }
                    }
                    question.answers.push(answer);
                }
                questions.push(question);
            }

            scenario.conversation = questions;

            console.log(scenario.conversation);

            /*
            $http.post('/scenario', {
                name: scenario.name,
                level: scenario.level,
                scenarioType: scenario.scenarioType,
                conversation: scenario.conversation
            })
                .success(function(data) {
                    console.log(data);
                    $location.path('/teacher');
                })
                .error(function(error) {
                    console.log(error);
                });
                */
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

    }
]);
