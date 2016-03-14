
angular.module('AddScenarioCtrl', []).controller('AddScenarioController', ['$scope', '$http', '$location', 'teacher',
    function($scope, $http, $location, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });


        $scope.questions = [];
        $scope.currentQuestion = {};
        $scope.currentQuestionIndex = 0;
        $scope.lastQuestionIndex = 5;
        $scope.numAnswers = 2;

        $scope.incQuestion = function() {
            $scope.saveCurrentQuestion();
            $scope.currentQuestionIndex++;
            $scope.loadCurrentQuestion();
        };

        $scope.decQuestion = function() {
            $scope.saveCurrentQuestion();
            $scope.currentQuestionIndex--;
            $scope.loadCurrentQuestion();
        };

        $scope.saveCurrentQuestion = function() {
            if($scope.correctAnswersEnabled() && $scope.currentQuestion.answers) {
                $.each($scope.currentQuestion.answers, function (key, answer) {
                    answer.correct = false;
                });
                if ($scope.correctAnswer > -1) {
                    $scope.currentQuestion.answers[$scope.correctAnswer].correct = true;
                }
            }
            $scope.questions[$scope.currentQuestionIndex] = $scope.currentQuestion;
        };

        $scope.loadCurrentQuestion = function() {
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
            var foundCorrect = false;
            if($scope.correctAnswersEnabled() && $scope.currentQuestion.answers) {
                $.each($scope.currentQuestion.answers, function(key, answer) {
                    if(answer.correct) {
                        $scope.correctAnswer = key;
                        foundCorrect = true;
                    }
                });
            }

            if(!foundCorrect) {
                $scope.correctAnswer = -1;
            }
        };

        $scope.setQuestionLimit = function() {
            $scope.lastQuestionIndex = ($scope.level * 5) - 1;
            if($scope.currentQuestionIndex > $scope.lastQuestionIndex) {
                $scope.currentQuestionIndex = $scope.lastQuestionIndex;
            }

            if($scope.level > 1) {
                $scope.numAnswers = 3;
            }

            $scope.questions = [];

            for(var i = 0; i <= $scope.lastQuestionIndex; i++) {
                $scope.questions[i] = {
                    question: '',
                    answers: [
                        { answer: ''},
                        { answer: ''}
                    ]
                };

                if($scope.enableTranslations) {
                    $scope.questions[i].translation = '';
                }

                if($scope.level > 1) {
                    $scope.questions[i].answers.push({ answer: '' });
                }

                if($scope.correctAnswersEnabled()) {
                    $.each($scope.questions[i].answers, function(key, answer) {
                        answer.correct = false;
                    });
                }
            }
        };

        $scope.checkQuestions = function() {
            $.each($scope.questions, function(key, val) {
            });
        };

        $scope.correctAnswersEnabled = function() {
            return $scope.type != 'Conversation';
        };

        $scope.ready = function(questions, status) {

            if(!$scope.name || !$scope.type || !$scope.level) {
                return status({
                    ready: false,
                    message: "Please make sure your scenario has a name, type and level!"
                });
            }
            if(teacher.containsScenario({
                    name: $scope.name,
                    level: parseInt($scope.level),
                    type: $scope.type
                })) {
                return status({
                    ready: false,
                    message: "Error, you have already created a scenario of this configuration!"
                });
            }

            var answerError = false;
            $.each(questions, function(key, question) {

                if(!question.answers) {
                    answerError = true;
                } else {
                    $.each(question.answers, function (key2, answer) {
                        if (answer.answer === '') {
                            answerError = true;
                        }
                    });
                }
            });

            if(answerError) {
                return status({
                    ready: false,
                    message: 'There is a problem with one or more of your questions, please make sure any questions you have contain all required fields!'
                });
            }

            return status({
                ready: true
            });

        };

        $scope.finish = function() {

            var finalQuestions = [];
            $.each($scope.questions, function(key, question) {
                if(question.question) {
                    question.answers = $.map(question.answers, function(arr) {return arr}) || []; //convert answers object to array
                    finalQuestions.push(question);
                }
            });

            $scope.ready(finalQuestions, function(status) {

                if(!status.ready) {
                    alert(status.message);
                } else {

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
                            alert('Your scenario has been successfully created and is now in your game enabler!');
                        })
                        .error(function (error) {
                            alert('Oops, there was a problem adding your scenario to our database! :(');
                        });
                }
            });
        };
    }
]);
