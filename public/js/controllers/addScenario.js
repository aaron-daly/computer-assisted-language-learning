
angular.module('AddScenarioCtrl', []).controller('AddScenarioController', ['$scope', '$http', '$location', 'Upload', 'teacher',
    function($scope, $http, $location, Upload, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.buildQuestionsForm = function() {

            if(!$scope.level || !$scope.type) {
                return;
            }

            var questionsSize = 5 * $scope.level;
            var answersSize = 2;
            if($scope.level > 1) answersSize++;

            $('#questions-container').empty();

            for(var i = 1; i <= questionsSize; i++) {

                $('#questions-container').append(
                    '<div class="form-group"><label>Question '+i+'</label><input class="form-control" type="text" name="q'+i+'"></div>'
                );

                var radioBtn = '';

                for(var j = 1; j <= answersSize; j++) {

                    if($scope.type != 'Conversation') {
                        radioBtn = ' <input type="radio" name="q' + i + 'correct" value="' + j + '">';
                    }

                    $('#questions-container').append(
                        '<div class="form-group"><label>Q'+i+' Answer '+j+'</label>' +
                        radioBtn +
                        '<input class="form-control" type="text" name="q'+i+'a'+j+'"></div>'
                    )
                }
                $('#questions-container').append('<hr>');
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
                        if($('input[name=' + 'q'+i+'correct]:checked').val() == j) {
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

            $http.post('/scenario', scenario)
                .success(function(data) {
                    teacher.addScenario(data);
                })
                .error(function(error) {
                    console.log(error);
                });

            $location.path('/teacher');

            // TODO SUBMIT QUESTIONS ONE AT A TIME
            // TODO FEEDBACK MESSAGE OF SUCCESS/ERROR
            // TODO PICTURE SUBMIT
            // TODO ADD TRANSLATIONS

            if($scope.picture.$valid && $scope.picture) {
                $scope.upload($scope.picture);
            }
        };

        $scope.upload = function(picture) {
            Upload.upload({
                url: 'http://localhost:8080/public/images',
                data: { file: picture }
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        $scope.cancel = function() {
            $location.path('/teacher');
        }

    }
]);
