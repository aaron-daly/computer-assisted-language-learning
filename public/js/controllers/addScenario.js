
angular.module('AddScenarioCtrl', []).controller('AddScenarioController', ['$scope', '$http', '$location', 'Upload', 'teacher',
    function($scope, $http, $location, Upload, teacher) {

        $(document).ready(function () {
            $(this).scrollTop(0);
        });


        $scope.questions = [];
        $scope.currentQuestion = {};
        $scope.currentQuestionIndex = 0;
        $scope.lastQuestionIndex = 5;
        $scope.numAnswers = 2;

        $scope.incQuestion = function () {
            $scope.saveCurrentQuestion();
            $scope.currentQuestionIndex++;
            $scope.loadCurrentQuestion();
        };

        $scope.decQuestion = function () {
            $scope.saveCurrentQuestion();
            $scope.currentQuestionIndex--;
            $scope.loadCurrentQuestion();
        };

        $scope.saveCurrentQuestion = function () {
            if ($scope.correctAnswersEnabled() && $scope.currentQuestion.answers) {
                $.each($scope.currentQuestion.answers, function (key, answer) {
                    answer.correct = false;
                });
                if ($scope.correctAnswer > -1) {
                    $scope.currentQuestion.answers[$scope.correctAnswer].correct = true;
                }
            }
            $scope.questions[$scope.currentQuestionIndex] = $scope.currentQuestion;
        };

        $scope.loadCurrentQuestion = function () {
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
            var foundCorrect = false;
            if ($scope.correctAnswersEnabled() && $scope.currentQuestion.answers) {
                $.each($scope.currentQuestion.answers, function (key, answer) {
                    if (answer.correct) {
                        $scope.correctAnswer = key;
                        foundCorrect = true;
                    }
                });
            }

            if (!foundCorrect) {
                $scope.correctAnswer = -1;
            }
        };

        $scope.setQuestionLimit = function () {
            $scope.lastQuestionIndex = ($scope.level * 5) - 1;
            if ($scope.currentQuestionIndex > $scope.lastQuestionIndex) {
                $scope.currentQuestionIndex = $scope.lastQuestionIndex;
            }

            if ($scope.level > 1) {
                $scope.numAnswers = 3;
            }

            $scope.questions = [];

            for (var i = 0; i <= $scope.lastQuestionIndex; i++) {
                $scope.questions[i] = {
                    question: '',
                    answers: [
                        {answer: ''},
                        {answer: ''}
                    ]
                };

                if ($scope.enableTranslations) {
                    $scope.questions[i].translation = '';
                }

                if ($scope.level > 1) {
                    $scope.questions[i].answers.push({answer: ''});
                }

                if ($scope.correctAnswersEnabled()) {
                    $.each($scope.questions[i].answers, function (key, answer) {
                        answer.correct = false;
                    });
                }
            }
        };

        $scope.checkQuestions = function () {
            $.each($scope.questions, function (key, val) {
            });
        };

        $scope.correctAnswersEnabled = function () {
            return $scope.type != 'Conversation';
        };

        $scope.ready = function () {

            if (!$scope.name || !$scope.type || !$scope.level) {
                return false;
            }

            var finalQuestions = [];
            $.each($scope.questions, function (key, question) {
                if (question.question != '') {
                    finalQuestions.push(question);
                }
            });

            $.each(finalQuestions, function (key, question) {

                if ($scope.translationsEnabled && question.translation === '') {
                    return false;
                }

                $.each(question.answers, function (key, answer) {
                    if (answer.answer === '') {
                        return false;
                    }
                });

            });

            return true;
        };

        $scope.finish = function () {

            if (!$scope.name) {
                //TODO SHOW NO NAME ERROR;
            }
            //TODO CHECK IF SCENARIO COMBO LREADY EXISTS
            else {
                var finalQuestions = [];

                $.each($scope.questions, function(key, question) {
                    if(question.question != '') {
                        question.answers = $.map(question.answers, function(arr) {return arr}); //convert answers object to array
                        finalQuestions.push(question);
                    }
                });
                var scenario = {
                    name: $scope.name,
                    level: parseInt($scope.level),
                    scenarioType: $scope.type
                };

                scenario.conversation = finalQuestions;

                $http.post('/scenario', scenario)
                    .success(function (data) {
                        teacher.addScenario(data);
                        $location.path('/teacher');
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
        }

                /*


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


            if(!teacher.containsScenario({
                    name: $scope.name,
                    type: $scope.type,
                    level: $scope.level
                })
            ) {

                var questionsSize = 5 * $scope.level;
                var answersSize = 2;

                if ($scope.level > 1) {
                    answersSize++;
                }

                var scenario = {
                    name: $scope.name,
                    level: $scope.level,
                    scenarioType: $scope.type
                };

                var answer = {};

                var questions = [];

                for (var i = 1; i <= questionsSize; i++) {
                    var question = {};
                    question.question = $('input[name=q' + i + ']').val();
                    question.answers = [];

                    if (!question.question) {
                        break;
                    }

                    for (var j = 1; j <= answersSize; j++) {
                        answer = {};
                        answer.answer = $('input[name=q' + i + 'a' + j + ']').val();
                        if ($scope.type != 'Conversation') {
                            if ($('input[name=' + 'q' + i + 'correct]:checked').val() == j) {
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
                console.log(scenario);

                // TODO REJECT SCENARIO IF ALREADY IN TEACHER GROUP
                $http.post('/scenario', scenario)
                    .success(function (data) {
                        teacher.addScenario(data);
                        //$location.path('/teacher');
                    })
                    .error(function (error) {
                        console.log(error);
                    });


                // TODO SUBMIT QUESTIONS ONE AT A TIME
                // TODO FEEDBACK MESSAGE OF SUCCESS/ERROR
                // TODO PICTURE SUBMIT
                // TODO ADD TRANSLATIONS

                if ($scope.picture.$valid && $scope.picture) {
                    $scope.upload($scope.picture);
                }
            } else {
                console.log('already exists');
            }

        };

        $scope.upload = function(picture) {
            Upload.upload({
                url: '/scenario/image/upload',
                    file: picture,
                    'scenarioType': $scope.type,
                    'scenarioName': $scope.name
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            })
        };

        $scope.cancel = function() {
            $location.path('/teacher');
        }*/
    }
]);
