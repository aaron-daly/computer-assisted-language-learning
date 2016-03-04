/**
 * Created by Raphaelle on 04/03/2016.
 */
angular.module('PictureGameCtrl', []).controller('PictureGameController', ['$scope', '$routeParams', '$location', 'pictureGame',
    function($scope, $routeParams, $location, pictureGame) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

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

            $.each(results.questions, function(key, val) {

                var questionHTML = '<h2>' + val + '</h2>';
                var answerHTML = '<h4>' + results.answers[key] + '</h4>';

                $('#answer-container').append(questionHTML).append(answerHTML);
            });

            $('#return-btn').show();

        };

        $scope.profileReturn = function() {
            $location.path('/profile');
        };


        pictureGame.initGame(function(data) {
            $scope.drawQuestion(data);

            $('.answer-btn').click(function(){

                var answer = $(this).text();
                var branch = $(this).val();

                $scope.tick({
                    answer: answer,
                    branch: branch
                });
            });

        });

    }
]);