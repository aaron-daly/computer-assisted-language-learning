/**
 * Created by Raphaelle on 07/03/2016.
 */
angular.module('WordGameCtrl', []).controller('WordGameController', ['$scope', '$routeParams', '$route', '$location', 'wordGame', 'teacher',
    function($scope, $routeParams, $route, $location, wordGame, teacher) {

        $(document).ready(function(){
            $(this).scrollTop(0);
        });

        $('#replay-btn').hide();
        $('#return-btn').hide();

        $scope.scenario = wordGame.scenario;

        $scope.drawAnswer = function(answer) {
            var html = '<button class="btn btn-info answer-btn" value="' + answer.branch + '">' + answer.answer + '</button>';
            $('#answer-container').append(html);
        };

        //increments image number.
        var count = 0;
        $scope.drawQuestion = function(question) {

            var questionHtml = '<h2>' + question.question +'<img src="../images/'+$scope.scenario.name+'/Image'+count+'.jpg" style="width:50px;height:50px;display:inline;"/>'+ '</h2>';
            count++;
            $('#current-question').append(questionHtml);


            $.each(question.answers, function(key, val) {
                $scope.drawAnswer(val);
            });

        };

        $scope.clearScreen = function() {
            $('#answer-container').empty();
            $('#current-question').empty();
        };

        $scope.tick = function(answer){
            wordGame.tick(answer, function(data) {

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
                questionHTML = '<h2>' + val +'<img src="../images/'+$scope.scenario.name+'/Image'+key+'.jpg" style="width:50px;height:50px;display:inline;"/>'+ '</h2>';
                //if the correct value in corresponding position of array is true then ....
                if (results.correct[key]) {
                    answerHTML = '<h4 class="text-success" style="color:green" >' + results.answers[key] + '<span class="glyphicon glyphicon-ok"></span>' + '</h4>';
                }
                else {
                    answerHTML = '<h4 class="text-success" style="color:red" >' + results.answers[key] + '<span class="glyphicon glyphicon-remove"></span>' + '</h4>';
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


        wordGame.initGame(function(data) {
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

