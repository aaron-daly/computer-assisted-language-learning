/**
 * Created by Raphaelle on 24/02/2016.
 */
/**
 * Created by Raphaelle on 24/02/2016.
 */
angular.module('Mini2Ctrl', []).controller('Mini2Controller', ['$scope','$location', '$http',
    function($scope,$location) {

        $(document).ready(function () {
            $(this).scrollTop(0);
        });
        $scope.preview = function() {
            $location.path('/preview');
        };
        $scope.mini2 = function() {
            $location.path('/mini2');
        };
        $scope.mini3 = function() {
            $location.path('/mini3');
        };
        //TO BE DONE --- GET JSON FILES WORKING!!!!
        var scenario =
        {
            "name": "conversationSample",
            "level": "1",
            "questions":[
                {
                    "question": "Hi, how are you?",
                    "position": "1",
                    "answers": [
                        {
                            "answer": "I am good",
                            "branch": "2"
                        },
                        {
                            "answer": "I am not well",
                            "branch": "3"
                        },
                        {
                            "answer": "I don't want to talk",
                            "branch": "0"
                        }
                    ]
                },

                {
                    "question": "Great! Me too, what are you up to?",
                    "position": "2",
                    "answers": [
                        {
                            "answer": "Chilling out",
                            "branch": "4"
                        },
                        {
                            "answer": "Busy studying",
                            "branch": "0"
                        }
                    ]
                },

                {
                    "question": "Ohh, how come?",
                    "position": "3",
                    "answers": [
                        {
                            "answer": "I am sick",
                            "branch": "4"
                        },
                        {
                            "answer": "I don't want to talk about it",
                            "branch": "0"
                        }
                    ]
                },
                {
                    "question": "Sorry to hear that, I'll leave you be, bye!",
                    "position": "4",
                    "answers": [
                        {
                            "answer": "Alright, goodbye",
                            "branch": "0"
                        }
                    ]
                }

            ]
        }
            ;

        var questions = scenario.questions;
        var initialQuestion = 1;

        $scope.recordedQuestions = [];
        $scope.recordedAnswers = [];

        //-------------------------
        //--------FUNCTIONS--------


        //APPEND HTML FOR A QUESTION
        $scope.appendQuestion = function(q) {
            console.log('appending QS: ' + q);
            $('#mini2-body').append('<h1>' + q + '</h1>');
            $scope.recordQuestion(q);
        };


        //APPEND HTML FOR AN ANSWER BUTTON
        $scope.appendAnswer = function(pos, val) {
            console.log('appending ANS: ' + val.answer);
            var idtag = 'q' + pos + 'b' + val.branch;
            $('#mini2-body').append('<button id="' + idtag + '" class="btn btn-success answer-button">' + val.answer + '</button>');
        };


        //APPEND SOME HTML WITH TAG 'tag' AND CONTENT 't'
        $scope.appendText = function(tag, t) {
            $('#mini2-body').append(tag + t);
        };


        //RECORD QUESTION
        $scope.recordQuestion = function(q) {
            console.log('QUESTION RECORDED: ' + q);
            $scope.recordedQuestions.push(q);
        };


        //RECORD ANSWER CHOSEN
        $scope.recordAnswer = function(a) {
            console.log('ANSWER RECORDED: ' + a);
            $scope.recordedAnswers.push(a);
        };


        //LOAD NEXT QUESTION WITH ANSWERS
        $scope.loadQuestion = function(pos) {

            $('#mini2-body').empty().hide();

            if(pos > 0) { //We haven't reached delimiter 0, i.e. answer choosen has a preceding question
                var data = questions[pos-1];
                var answers = data.answers;
                $scope.appendQuestion(data.question);

                $.each(answers, function (key, val) {
                    $scope.appendAnswer(key, val);
                });

                $('#mini2-body').fadeIn("fast");

                $('.answer-button').click(function () {
                    $scope.recordAnswer($(this).html());
                    $scope.loadQuestion($scope.getNextQuestion(this.id));
                })
            }
            else { //Answer chosen has no preceding question(s), conversation finished
                $scope.finishGame();
            }
        };

        //RETRIEVE THE NEXT QUESTION DEPENDING ON THE IDTAG OF THE ANSWER CHOSEN FOR THE CURRENT QUESTION
        $scope.getNextQuestion = function(idtag) {
            console.log("answer id: " + idtag);
            return idtag.substr(idtag.length-1, idtag.length);
        };


        //INITIALISE MINI-GAME
        $scope.initGame = function() { //initiate preview game
            $('button').hide();
            $scope.loadQuestion(initialQuestion); //load initial question
        };

        //FINISH GAME, DISPLAY RESULTS
        $scope.finishGame = function() {
            console.log('GAME FINISHED');
            var i = 0;
            var len = $scope.recordedQuestions.length;

            $scope.appendText('<h1>', "Let's see your answers!");

            for(i; i < len; i++) {

                console.log("Q" + i + ": " + $scope.recordedQuestions[i]);
                console.log("A" + i + ": " + $scope.recordedAnswers[i]);

                $scope.appendText('<h2 class="text-info">', $scope.recordedQuestions[i]);
                $scope.appendText('<h3 class="text-success">', $scope.recordedAnswers[i]);
                $('#mini2-body').append('<hr>');
            }

            $('#mini2-header').hide();

            $('#mini2-body').fadeIn('slow');
            $('#replay-button').fadeIn('slow');
        };


        //REPLAYS CURRENT GAME
        $scope.replayGame = function() {
            $scope.recordedQuestions = [];
            $scope.recordedAnswers = [];
            initialQuestion = 1;
            $('#mini2-body').empty();
            $('#mini2-header').show();
            $('#replay-button').hide();
            $scope.init();
        };


        //INITIALISE VIEW
        $scope.init = function() {
            $('#mini2-container').hide();
            $('#mini2-body').hide();
            $('#replay-button').hide();
            $('#mini2-container').fadeIn("slow");
            $('#play-button').fadeIn("slow");
            $('#play2-button').fadeIn("slow");
        };


        //--------------------------------------------------
        //------------ EXECUTION ---------------------------

        $scope.init();

    }

]);
