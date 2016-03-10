/**
 * Created by Dalyy on 26/02/2016.
 */
/**
 * Created by Dalyy on 23/02/2016.
 */
angular.module('ConversationGameCtrl', []).controller('ConversationGameController', ['$scope', '$routeParams', '$route', '$location', 'conversationGame', 'teacher',
    function($scope, $routeParams, $route, $location, conversationGame, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $('#replay-btn').hide();
        $('#return-btn').hide();

        $scope.scenario = conversationGame.scenario;

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
            conversationGame.tick(answer, function(data) {

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

            teacher.logScenarioCompletion($scope.scenario);

            $.each(results.questions, function(key, val) {

                var questionHTML = '<h2>' + val + '</h2>';
                var answerHTML = '<h4>' + results.answers[key] + '</h4>';

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


        conversationGame.initGame(function(data) {
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