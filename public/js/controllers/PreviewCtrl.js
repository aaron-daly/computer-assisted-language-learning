// public/js/controllers/PreviewCtrl.js
angular.module('PreviewCtrl', []).controller('PreviewController', ['$scope','$location', 'scenario', 'game',
    function($scope, $location, scenario, game) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $scope.scenario = {};

        var questions = [];
        var initialQuestion = 1;

        $scope.recordedQuestions = [];
        $scope.recordedAnswers = [];

        // get scenario of type 'c' called 'sweetshop'
        scenario.get('c', 'sweetshop', function(data) {
            console.log(data);
            $scope.scenario = data;
            questions = data.conversation;
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
        "scenario": "conversation",
            "level": "1",
            "questions":[
                {
                    "question": "Dia duit",
                    "position": "1",
                    "answers": [
                        {
                            "answer": "Dia is muire duit",
                            "branch": "2"
                        }
                    ]//end "answers"
                },

                {
                    "question": "An raibh tú ar scoil innu?",
                    "position": "2",
                    "answers": [
                        {
                            "answer": "Bhi mé ar scoil innu",
                            "branch": "3"
                        },
                        {
                            "answer": "Ni raibh me ar scoil innu",
                            "branch": "3"
                        }
                    ] //end "answers"
                },

                {
                    "question": "An maith leat milsean?",
                    "position": "3",
                    "answers": [
                        {
                            "answer": "Is maith liom milsean",
                            "branch": "4"
                        },
                        {
                            "answer": "Ni maith liom milsean",
                            "branch": "5"
                        },
                        {
                            "answer": "Is fearr liom seaclaid",
                            "branch": "6"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Cen milsean a mhaith leat?",
                    "position": "4",
                    "answers": [
                        {
                            "answer": "brioscai",
                            "branch": "6"
                        },
                        {
                            "answer": "caca milise",
                            "branch": "6"
                        },
                        {
                            "answer": "criospai",
                            "branch": "6"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Ar maith leat deoch?",
                    "position": "5",
                    "answers": [
                        {
                            "answer": "D'ol me coc",
                            "branch": "6"
                        },
                        {
                            "answer": "D'ol me bainne",
                            "branch": "6"
                        },
                        {
                            "answer": "Is fearr liom uachtar roeite",
                            "branch": "6"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Seo dhuit, An bhfuil airgead agat?",
                    "position": "6",
                    "answers": [
                        {
                            "answer": "Ta airgead agam",
                            "branch": "7"
                        },
                        {
                            "answer": "Seo dhuit an t-airgead",
                            "branch": "7"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Ar mhaith leat mala?",
                    "position": "7",
                    "answers": [
                        {
                            "answer": "Ba maith liom mala",
                            "branch": "8"
                        },
                        {
                            "answer": "Nior mhaith liom mala",
                            "branch": "8"
                        },
                        {
                            "answer": "Is feidir liom iad a ithe anois",
                            "branch": "8"
                        }
                    ] //end "answers"
                },
                {
                    "question": "Go raibh maith agat, Slan",
                    "position": "8",
                    "answers": [
                        {
                            "answer": "Slan",
                            "branch": "0"
                        },
                        {
                            "answer": "Go raibh maith agat",
                            "branch": "0"
                        },
                        {
                            "answer": "Slan go fol",
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

        //-------------------------
        //--------FUNCTIONS--------


        //APPEND HTML FOR A QUESTION
        $scope.appendQuestion = function(q) {
            console.log('appending QS: ' + q);
            $('#preview-body').append('<img src="../images/avatar.jpg" alt="sweetshop.jpg" style="width:300px;height:275px;">' + '<h1>' + q + '</h1>');
            $scope.recordQuestion(q);
        };


        //APPEND HTML FOR AN ANSWER BUTTON
        $scope.appendAnswer = function(pos, val) {
            console.log('appending ANS: ' + val.answer);
            var idtag = 'q' + pos + 'b' + val.branch;
            $('#preview-body').append('<button id="' + idtag + '" class="btn btn-success answer-button">' + val.answer + '</button>');
        };


        //APPEND SOME HTML WITH TAG 'tag' AND CONTENT 't'
        $scope.appendText = function(tag, t) {
            $('#preview-body').append(tag + t);
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

            $('#preview-body').empty().hide();

            if(pos > 0) { //We haven't reached delimiter 0, i.e. answer choosen has a preceding question
                var data = questions[pos-1];
                var answers = data.answers;
                $scope.appendQuestion(data.question);

                $.each(answers, function (key, val) {
                    $scope.appendAnswer(key, val);
                });

                $('#preview-body').fadeIn("fast");

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
            $('#play-button').hide();
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
                $('#preview-body').append('<hr>');
            }

            $('#preview-header').hide();

            $('#preview-body').fadeIn('slow');
            $('#replay-button').fadeIn('slow');
            $('#next-button').fadeIn('slow');
        };


        //REPLAYS CURRENT GAME
        $scope.replayGame = function() {
            $scope.recordedQuestions = [];
            $scope.recordedAnswers = [];
            initialQuestion = 1;
            $('#preview-body').empty();
            $('#preview-header').show();
            $('#replay-button').hide();
            $('#next-button').hide();
            $scope.init();
        };


        //INITIALISE VIEW
        $scope.init = function() {
            $('#preview-container').hide();
            $('#preview-body').hide();
            $('#replay-button').hide();
            $('#next-button').hide();
            $('#preview-container').fadeIn("slow");
            $('#play-button').fadeIn("slow");
            $('#play2-button').fadeIn("slow");
        };


        var url = 'http://www.abair.tcd.ie/api/?input=dia%20dhuit&format=mp3';


        //--------------------------------------------------
        //------------ EXECUTION ---------------------------

        $scope.init();

    }


]);