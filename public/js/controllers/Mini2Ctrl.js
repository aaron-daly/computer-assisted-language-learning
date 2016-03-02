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
        var scenario = {
            "scenario": "picture",
            "level": "1",
            "questions":[
                {
                    "question": "Whats in da foto?",
                    "position": "1",
                    "answers": [
                        {
                            "answer": "sweetshop",
                            "branch": "2"
                        },
                        {
                            "answer": "library",
                            "branch": "2"
                        },
                        {
                            "answer": "ospideal",
                            "branch": "2"
                        }
                    ]//end "answers"
                },

                {
                    "question": "is the shop keeper male or female?",
                    "position": "2",
                    "answers": [
                        {
                            "answer": "male",
                            "branch": "3"
                        },
                        {
                            "answer": "female",
                            "branch": "3"
                        },
                        {
                            "answer": "i dont understand",
                            "branch": "3"
                        }
                    ] //end "answers"
                },

                {
                    "question": "how many chocolate bars?",
                    "position": "3",
                    "answers": [
                        {
                            "answer": "4",
                            "branch": "4"
                        },
                        {
                            "answer": "3",
                            "branch": "4"
                        },
                        {
                            "answer": "2",
                            "branch": "4"
                        }
                    ] //end "answers"
                },
                {
                    "question": "how many cakes",
                    "position": "4",
                    "answers": [
                        {
                            "answer": "1",
                            "branch": "0"
                        },
                        {
                            "answer": "3",
                            "branch": "0"
                        },
                        {
                            "answer": "2",
                            "branch": "0"
                        }
                    ] //end "answers"
                }

            ] //end "questions"
        };

        var questions = scenario.questions;
        var initialQuestion = 1;

        $scope.recordedQuestions = [];
        $scope.recordedAnswers = [];
        $scope.recordedCorrectAnswers = ["sweetshop", "male","3","3"];

        //-------------------------
        //--------FUNCTIONS--------


        //APPEND HTML FOR A QUESTION
        $scope.appendQuestion = function(q) {
            console.log('appending QS: ' + q);
            $('#mini2-body').append('<img src="../images/sweetshop.jpg" alt="sweetshop.jpg" style="width:400px;height:275px;">' + '<h1>' + q + '</h1>');
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
                //STUDENTS ANSWER
                console.log("A" + i + ": " + $scope.recordedAnswers[i]);


                $scope.appendText('<h2 class="text-info" >', $scope.recordedQuestions[i]);
                //STUDENTS ANSWER
                if ($scope.recordedAnswers[i] != $scope.recordedCorrectAnswers[i]) {
                    $scope.appendText('<h3 class="text-success", style= "color:red" >', $scope.recordedAnswers[i] +'<span class="glyphicon glyphicon-remove"></span>');
                } else {
                    $scope.appendText('<h3 class="text-success", style="color:green ">', $scope.recordedAnswers[i] + '<span class="glyphicon glyphicon-ok"></span>');
                }



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
            $scope.recordedCorrectAnswers = [];
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
