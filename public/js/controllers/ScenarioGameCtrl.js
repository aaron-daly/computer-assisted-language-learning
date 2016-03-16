/**
 * Created by Raphaelle on 10/03/2016.
 */
angular.module('ScenarioGameCtrl', []).controller('ScenarioGameController', ['$scope', '$routeParams', '$route', '$location', 'auth', 'scenarioGame', 'teacher',
    function($scope, $routeParams, $route, $location, auth, scenarioGame, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $('#replay-btn').hide();
        $('#return-btn').hide();

        $scope.scenario = scenarioGame.scenario; //type in here

        $scope.drawAnswer = function(answer) {
            var html = '<button class="btn btn-info answer-btn" value="' + answer.branch + '">' + answer.answer + '</button>';
            $('#answer-container').append(html);
        };

        var count=0;
        $scope.drawQuestion = function(question) {
            if ($scope.scenario.scenarioType.name == "Word") {
                var questionHtml = '<h2>' + question.question + '<img src="../images/wordSample/Image' + count + '.jpg" style="width:50px;height:50px;display:inline;"/>' + '</h2>';
                count++;
                $('#current-question').append(questionHtml);
            }
             else{
                $('#current-question').append(question.question);
            }

            $.each(question.answers, function(key, val) {
                $scope.drawAnswer(val);
            });
        };

        // TODO SHOW TRANSLATIONS ON RESULTS PAGE...
        $scope.drawTranslations = function(translation) {
            console.log(scenarioGame.scenario.conversation[scenarioGame.position -1].translation);//!!!!!!!!!!!!!!!!!!!
            if (scenarioGame.scenario.conversation[scenarioGame.position -1].translation){
                 var translationHTML = '<h2>' + translation.translation + '</h2>';
                 $('#current-question').append(translationHTML);
             }
        };
        var questionCount=1;
        var levelCount=0;
        $scope.showAudio = function() {
            $('#scenarioGame-audio').empty();
            if ($scope.scenario.scenarioType.name == "Conversation"){
                //$('#scenarioGame-audio').show();
                console.log($scope.scenario.level);
                levelCount = $scope.scenario.level;
                var audioHTML = '<h2>' + '<audio controls>'+ '<source src="../audio/sweetshop/level'+levelCount+'/q'+questionCount+'.wav" type="audio/wav">'
                    + '</audio>' + '</h2>';
                $('#scenarioGame-audio').append(audioHTML);
                $('#scenarioGame-audio').show();

            }
        };

        $scope.clearScreen = function() {
            $('#answer-container').empty();
            $('#current-question').empty();
        };

        $scope.tick = function(answer){
            scenarioGame.tick(answer, function(data) {
                $scope.clearScreen();


                if(data.question) {
                    $('#scenarioGame-audio').hide();
                    $scope.drawQuestion(data);
                    questionCount++;

                    $scope.drawTranslations(data);                  //!!!!!!!!!!!!!!!!!

                    $('.answer-btn').click(function () {

                        var answer = $(this).text();

                        $scope.tick({
                            answer: answer,
                        });
                    });
                } else {
                    $scope.finish(data);
                }

            });
        };


        $scope.finish = function(results) {
            questionCount=0;

            var isCompleted = true;
            if(results.correct) {
                for (var i = 0; i < results.correct.length; i++) {
                    if (!results.correct[i]) {
                        isCompleted = false;
                    }
                }
            }

            var isCompleted = true;
            if(results.translations) {
                for (var i = 0; i < results.translations.length; i++) {
                    if (!results.translations[i]) {                                                         //!!!!!!!!!
                        isCompleted = false;
                    }
                }
            }

            var isCompleted = true;
            if(results.correctAnswers) {
                for (var i = 0; i < results.correctAnswers.length; i++) {
                    if (!results.correctAnswers[i]) {
                        isCompleted = false;
                    }
                }
            }

            // if game completed...
            if(isCompleted) {
                // authorize permission level 2 (pupil/student)
                auth.authorizePermission(2, function(authorized) {
                    if(authorized) { // if authorized, log scenario completion
                        teacher.logScenarioCompletion($scope.scenario);
                    }
                });
            }

            var questionHTML = 0;
            var answerHTML = 0;

            $.each(results.questions, function(key, val) {
                questionHTML = '<h2>' + val + '</h2>';

                //if the correct value in corresponding position of array is true then ....
                if (results.correct.length != 0) {
                    //if results.correct is true print question and right answer.
                    if (results.correct[key]) {
                        answerHTML = '<h4 class="text-success" style= "color:green" >'
                            + results.answers[key] + '<span class="glyphicon glyphicon-ok"></span>' + '</h4>';
                    }
                    //if false print question answer and correct answer.
                    else {
                        answerHTML = '<h4 class="text-success" style= "color:red" >' + results.answers[key] +
                            '<span class="glyphicon glyphicon-remove"></span>' +
                            '<span class="text-success" style= "color:Green" >'
                            + results.correctAnswers[key] + '</span>'+ '</h4>';
                        //put the correct answer beside.
                    }
                    $('#answer-container').append(questionHTML).append(answerHTML);
                }
                else {
                answerHTML = '<h4>' + results.answers[key] + '</h4>';
                $('#answer-container').append(questionHTML).append(answerHTML);
                }
            });

            $('#replay-btn').show();
            $('#return-btn').show();
        };





        $scope.gameReplay = function() {
            $route.reload();
        };

        $scope.profileReturn = function() {
            $location.path('/profile');
        };


        scenarioGame.initGame(function(data) {
            $('#scenarioGame-audio').hide();
        //condition for picture scenario
          if ($scope.scenario.scenarioType.name != "Picture"){
                $('#scenarioGame-picture').hide();
            }
            else {
             $('#scenarioGame-picture').show();
            }

            $scope.drawQuestion(data);

            $('.answer-btn').click(function(){

                var answer = $(this).text();

                $scope.tick({
                    answer: answer
                });
            });

        });

    }
]);

