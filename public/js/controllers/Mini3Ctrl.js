/**
 * Created by Raphaelle on 24/02/2016.
 */

angular.module('Mini3Ctrl', []).controller('Mini3Controller', ['$scope','$location', '$http',
    function($scope,$location) {

        $(document).ready(function () {
            $(this).scrollTop(0);
        });
        $scope.preview = function () {
            $location.path('/preview');
        };
        $scope.mini2 = function () {
            $location.path('/mini2');
        };
        $scope.mini3 = function () {
            $location.path('/mini3');
        };
        $scope.results = function () {
            $location.path('/results');
        };
        //TO BE DONE --- GET JSON FILES WORKING!!!!
        var scenario = {
            "scenario": "picture",
            "level": "1",
            "questions":[
                {
                    "question": "Is maith liom ",
                    "position": "1",
                    "answers": [
                        {
                            "answer": "seaclaid",
                            "branch": "2"
                        },
                        {
                            "answer": "brioscai",
                            "branch": "2"
                        },
                        {
                            "answer": "caca milis",
                            "branch": "2"
                        }
                    ]//end "answers"
                },

                {
                    "question": "Is fearr liom ",
                    "position": "2",
                    "answers": [
                        {
                            "answer": "seaclaid",
                            "branch": "3"
                        },
                        {
                            "answer": "criospai",
                            "branch": "3"
                        },
                        {
                            "answer": "milsean",
                            "branch": "3"
                        }
                    ] //end "answers"
                },

                {
                    "question": "D'ith me ",
                    "position": "3",
                    "answers": [
                        {
                            "answer": "bainne",
                            "branch": "4"
                        },
                        {
                            "answer": "caca milis",
                            "branch": "4"
                        },
                        {
                            "answer": "uisce",
                            "branch": "4"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Thug siad  ",
                    "position": "4",
                    "answers": [
                        {
                            "answer": "uachtar reoite",
                            "branch": "5"
                        },
                        {
                            "answer": "bonbons",
                            "branch": "5"
                        },
                        {
                            "answer": "criospai",
                            "branch": "5"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Ni raibh me ag ithe ",
                    "position": "5",
                    "answers": [
                        {
                            "answer": "uachtar reoite",
                            "branch": "6"
                        },
                        {
                            "answer": "bonbons",
                            "branch": "6"
                        },
                        {
                            "answer": "criospai",
                            "branch": "6"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Pioc me alan",
                    "position": "6",
                    "answers": [
                        {
                            "answer": "uachtar reoite",
                            "branch": "7"
                        },
                        {
                            "answer": "milsean",
                            "branch": "7"
                        },
                        {
                            "answer": "criospai",
                            "branch": "7"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Bhi pol ag ol ",
                    "position": "7",
                    "answers": [
                        {
                            "answer": "uachtar reoite",
                            "branch": "0"
                        },
                        {
                            "answer": "bainne",
                            "branch": "0"
                        },
                        {
                            "answer": "criospai",
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
        $scope.recordedCorrectAnswers = ["brioscai", "seaclaid", "caca milis", "uachtar reoite", "criospai","milsean","bainne"];

        //-------------------------
        //--------FUNCTIONS--------


        //APPEND HTML FOR A QUESTION
        var x = 1;
        $scope.appendQuestion = function(q) {
            console.log('appending QS: ' + q);

            if(x==1) {
                //if (number q then pic image accordingly)
                $('#mini3-body').append('<h1>' + q + '<img src="../images/cookies.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h1>');
            }
            if(x==2){
                $('#mini3-body').append('<h1>' + q + '<img src="../images/chocolate.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h1>');
            }
            if(x==3){
                $('#mini3-body').append('<h1>' + q + '<img src="../images/cake.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h1>');
            }
            if(x==4){
                $('#mini3-body').append('<h1>' + q + '<img src="../images/icecream.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h1>');
            }
            if(x==5){
                $('#mini3-body').append('<h1>' + q + '<img src="../images/crisps.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h1>');
            }
            if(x==6){
                $('#mini3-body').append('<h1>' + q + '<img src="../images/candy.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h1>');
            }
            if(x==7){
                $('#mini3-body').append('<h1>' + q + '<img src="../images/milk.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h1>');
            }
            x++;
            $scope.recordQuestion(q);
        };


        //APPEND HTML FOR AN ANSWER BUTTON
        $scope.appendAnswer = function(pos, val) {
            console.log('appending ANS: ' + val.answer);
            var idtag = 'q' + pos + 'b' + val.branch;
            $('#mini3-body').append('<button id="' + idtag + '" class="btn btn-success answer-button">' + val.answer + '</button>');
        };


        //APPEND SOME HTML WITH TAG 'tag' AND CONTENT 't'
        $scope.appendText = function(tag, t) {
            $('#mini3-body').append(tag + t);
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

            $('#mini3-body').empty().hide();

            if(pos > 0) { //We haven't reached delimiter 0, i.e. answer choosen has a preceding question
                var data = questions[pos-1];
                var answers = data.answers;
                $scope.appendQuestion(data.question);

                $.each(answers, function (key, val) {
                    $scope.appendAnswer(key, val);
                });

                $('#mini3-body').fadeIn("fast");

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

                if(i==0) {
                    $scope.appendText('<h2 class="text-info">', '<img src="../images/cookies.jpg" style="width:50px;height:50px;display:inline;"/>');
                }
                if(i==1) {
                    $scope.appendText('<h2 class="text-info">', '<img src="../images/chocolate.jpg" style="width:50px;height:50px;display:inline;"/>');
                }
                if(i==2) {
                    $scope.appendText('<h2 class="text-info">', '<img src="../images/cake.jpg" style="width:50px;height:50px;display:inline;"/>');
                }
                if(i==3) {
                    $scope.appendText('<h2 class="text-info">', '<img src="../images/icecream.jpg" style="width:50px;height:50px;display:inline;"/>');
                }
                if(i==4) {
                    $scope.appendText('<h2 class="text-info">', '<img src="../images/crisps.jpg" style="width:50px;height:50px;display:inline;"/>');
                }
                if(i==5) {
                    $scope.appendText('<h2 class="text-info">', '<img src="../images/candy.jpg" style="width:50px;height:50px;display:inline;"/>');
                }
                if(i==6) {
                    $scope.appendText('<h2 class="text-info">', '<img src="../images/milk.jpg" style="width:50px;height:50px;display:inline;"/>');
                }
                if($scope.recordedAnswers[i] != $scope.recordedCorrectAnswers[i]) {
                    $scope.appendText('<h3 class="text-success", style = "color:red">', $scope.recordedAnswers[i] + '<span class="glyphicon glyphicon-remove"></span>');
                }
                else {
                    $scope.appendText('<h3 class="text-success">', $scope.recordedAnswers[i]+ '<span class="glyphicon glyphicon-ok"></span>');
                }
                $('#mini3-body').append('<hr>');
            }

            $('#mini3-header').hide();

            $('#mini3-body').fadeIn('slow');
            $('#replay-button').fadeIn('slow');
            $('#results-button').fadeIn('slow');
        };


        //REPLAYS CURRENT GAME
        $scope.replayGame = function() {
            $scope.recordedQuestions = [];
            $scope.recordedAnswers = [];
            initialQuestion = 1;
            $('#mini3-body').empty();
            $('#mini3-header').show();
            $('#replay-button').hide();
            $('#results-button').hide();
            $scope.init();
        };


        //INITIALISE VIEW
        $scope.init = function() {
            $('#mini3-container').hide();
            $('#mini3-body').hide();
            $('#replay-button').hide();
            $('#results-button').hide();
            $('#mini3-container').fadeIn("slow");
            $('#play-button').fadeIn("slow");
            $('#play2-button').fadeIn("slow");
        };


        //--------------------------------------------------
        //------------ EXECUTION ---------------------------

        $scope.init();

    }


]);
