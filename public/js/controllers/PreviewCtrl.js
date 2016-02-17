// public/js/controllers/PreviewCtrl.js
angular.module('PreviewCtrl', []).controller('PreviewController', ['$scope', '$http',
    function($scope, $http) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        //TO BE DONE --- GET JSON FILES WORKING!!!!
        var scenario = {
        "scenario": "sweetshop",
            "level": "1",
            "questions":[
                {
                    "question": "How are you?",
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
                            "answer": "idk",
                            "branch": "0"
                        }
                    ]//end "answers"
                },

                {
                    "question": "That's good, would you like sweets?",
                    "position": "2",
                    "answers": [
                        {
                            "answer": "YES",
                            "branch": "4"
                        },
                        {
                            "answer": "NO",
                            "branch": "0"
                        }
                    ] //end "answers"
                },

                {
                    "question": "Oh no, would you like some sweets?",
                    "position": "3",
                    "answers": [
                        {
                            "answer": "yes",
                            "branch": "2"
                        },
                        {
                            "answer": "no",
                            "branch": "0"
                        }
                    ] //end "answers"
                },
                {
                    "question": "What sweets would you like?",
                    "position": "4",
                    "answers": [
                        {
                            "answer": "chocolate",
                            "branch": "0"
                        },
                        {
                            "answer": "bonbons",
                            "branch": "0"
                        }
                    ] //end "answers"
                }

            ] //end "questions"
        };

        var questions = scenario.questions;

        var questionsPosition = 0;

        //-------------------------
        //--------FUNCTIONS--------

        $scope.loadQuestion = function(pos) {

            $('#preview-body').empty().hide();

            if(pos > 0) {

                var data = questions[pos-1];
                var answers = data.answers;

                $('#preview-body').append('<h1>' + data.question + '</h1>');

                $.each(answers, function (key, val) {
                    var idtag = 'q' + pos + 'b' + val.branch;

                    $('#preview-body').append('<button id="' + idtag + '" class="btn btn-success">' + val.answer + '</button>');
                });

                $('#preview-body').fadeIn("slow");

                $('button').click(function () {
                    $scope.loadQuestion($scope.getNextQuestion(this.id));
                })
            } else {
                $('#preview-body').append('<h1>END OF CONVO</h1>').show();
            }
        };

        $scope.getNextQuestion = function(idtag) {
            console.log("answer id: " + idtag);
            return idtag.substr(idtag.length-1, idtag.length);
        };

        $scope.initGame = function() { //initiate preview game
            $('button').hide();
            $scope.loadQuestion(1); //load initial question
        };

        $scope.init = function() {
            $('#preview-container').fadeIn("slow");
        };


        //--------------------------------------------------
        //------------ EXECUTION ---------------------------

        $('#preview-container').hide();
        $('#preview-body').hide();
        $scope.init();

    }
]);