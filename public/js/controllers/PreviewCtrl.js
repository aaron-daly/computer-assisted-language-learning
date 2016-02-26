// public/js/controllers/PreviewCtrl.js
angular.module('PreviewCtrl', []).controller('PreviewController', ['$scope','$location', 'scenario',
    function($scope, $location, scenario) {

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


        //-------------------------
        //--------FUNCTIONS--------


        //APPEND HTML FOR A QUESTION
        $scope.appendQuestion = function(q) {
            console.log('appending QS: ' + q);
            $('#preview-body').append('<h1>' + q + '</h1>');
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
        };


        //REPLAYS CURRENT GAME
        $scope.replayGame = function() {
            $scope.recordedQuestions = [];
            $scope.recordedAnswers = [];
            initialQuestion = 1;
            $('#preview-body').empty();
            $('#preview-header').show();
            $('#replay-button').hide();
            $scope.init();
        };


        //INITIALISE VIEW
        $scope.init = function() {
            $('#preview-container').hide();
            $('#preview-body').hide();
            $('#replay-button').hide();
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