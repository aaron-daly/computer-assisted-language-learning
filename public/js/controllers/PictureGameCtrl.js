/**
 * Created by Raphaelle on 04/03/2016.
 */
angular.module('PictureGameCtrl', []).controller('PictureGameController', ['$scope', '$routeParams', '$route', '$location', 'pictureGame', 'teacher',
    function($scope, $routeParams, $route, $location, pictureGame, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $('#replay-btn').hide();
        $('#return-btn').hide();

        $scope.scenario = pictureGame.scenario;

        $scope.drawAnswer = function(answer) {
            var html = '<button class="btn btn-info answer-btn" value="' + answer.branch + '">' + answer.answer + '</button>';
            $('#answer-container').append(html);
        };

        $scope.drawQuestion = function(question) {

            $('#current-question').append(question.question);

            $.each(question.answers, function(key, val) {
                $scope.drawAnswer(val);
            });
        };

        $scope.clearScreen = function() {
            $('#answer-container').empty();
            $('#current-question').empty();
        };

        $scope.tick = function(answer){
            pictureGame.tick(answer, function(data) {

                $scope.clearScreen();

                if(data.position) {
                    $scope.drawQuestion(data);

                    $('.answer-btn').click(function () {

                        var answer = $(this).text();
                        var branch = $(this).val();

                        $scope.tick({
                            answer: answer,
                            branch: branch
                        });
                    });
                } else {
                    $scope.finish(data);
                }

            });
        };

        $scope.finish = function(results) {

            var isCompleted = true;

            for(var i = 0; i < results.correct.length; i++) {
                if(!results.correct[i]) {
                    isCompleted = false;
                }
            }

            if(isCompleted) {
                teacher.logScenarioCompletion($scope.scenario);
            }

            var questionHTML = 0;
            var answerHTML = 0;

                $.each(results.questions, function(key, val) {
                    questionHTML = '<h2>' + val + '</h2>';
                    //if the correct value in corresponding position of array is true then ....
                    if (results.correct[key]) {
                        answerHTML = '<h4 class="text-success" style= "color:green" >' + results.answers[key] + '<span class="glyphicon glyphicon-ok"></span>' + '</h4>';
                    }
                    else {
                        answerHTML = '<h4 class="text-success" style= "color:red" >' + results.answers[key] + '<span class="glyphicon glyphicon-remove"></span>' + '</h4>';
                    }
                    $('#answer-container').append(questionHTML).append(answerHTML);
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


        pictureGame.initGame(function(data) {
            $scope.drawQuestion(data);

            $('.answer-btn').click(function(){

                var answer = $(this).text();

                $scope.tick({
                    answer: answer,
                });
            });

        });

    }
]);
