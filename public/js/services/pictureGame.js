/**
 * Created by Raphaelle on 04/03/2016.
 */
angular.module('calliApp')

    .factory('pictureGame', ['$http', 'scenario',
        function($http, scenario){

            var pictureGame = {
                scenario: {},
                scenarioList: [],
                position: 1,
                recordedQuestions: [],
                recordedAnswers: [],
                recordedCorrectAnswers: [],
                isPlaying: false
            };


            //initiate game, callback first question
            pictureGame.initGame = function(callback) {

                /*
                 if(this.isPlaying) {
                 callback('Game in progress');
                 return;
                 }*/

                this.isPlaying = true;
                var firstQuestion = this.nextQuestion();
                callback(firstQuestion);

            };

            //receives answer, calls back next question
            pictureGame.tick = function(answer, callback) {
                this.recordedAnswers.push(answer.answer);

                //answer,branch,correct of current answer.
                var currentAnswers = pictureGame.scenario.conversation[pictureGame.position-1].answers;

                $.each(currentAnswers, function(key, val) {
                    if(val.answer == answer.answer) {
                        pictureGame.recordedCorrectAnswers.push(val.correct);
                    }
                });

                //if we reach delimiter position 0, callback results and release game
                this.position++;

                if(this.position >= this.scenario.conversation.length) {
                    callback(this.getResults());
                    this.release();
                } else {
                    //update position and callback next question
                    callback(this.nextQuestion());
                }

            };

            //results of questions and answers
            pictureGame.getResults = function() {
                return {
                    questions: this.recordedQuestions,
                    answers: this.recordedAnswers,
                    correct: this.recordedCorrectAnswers
                }
            };

            //release game data
            pictureGame.release = function() {
                this.scenario = {};
                this.position = 1;
                this.recordedQuestions = [];
                this.recordedAnswers = [];
                this.recordedCorrectAnswers = [];
            };

            //load question of game's current position
            pictureGame.nextQuestion = function() {
                var question = this.scenario.conversation[pictureGame.position-1];
                this.recordedQuestions.push(question.question);
                return question;
            };

            //loaf scenario for the game
            pictureGame.loadScenario = function(scenarioName, callback) {

                var i = 0;
                var len = pictureGame.scenarioList.length;
                var data = {};

                for(i; i < len; i++) {
                    if(pictureGame.scenarioList[i].name === scenarioName) {
                        data = pictureGame.scenarioList[i];
                        angular.copy(data, pictureGame.scenario);
                        callback(data);
                    }
                }

            };

            //preloads games into scenarioList
            pictureGame.preload = function() {

                scenario.getPictureScenarios(function(data) {
                    if(pictureGame.scenarioList.length == 0){
                        $.each(data, function(key, scenario) {
                            pictureGame.scenarioList.push(scenario);
                        })
                    }
                });
            };

            //return array of names of scenarios in scenarioList
            pictureGame.scenarioListNames = function() {
                var arr = [];
                var i = 0;
                var len = pictureGame.scenarioList.length;

                for(i; i < len; i++) {
                    arr.push(pictureGame.scenarioList[i].name);
                }

                return arr;
            };

            pictureGame.containsScenario = function(scenarioName) {
                if(pictureGame.scenarioList) {
                    var i = 0;
                    var len = pictureGame.scenarioList.length;
                    for(i; i<len; i++) {
                        if(pictureGame.scenarioList[i].name === scenarioName) {
                            return true;
                        }
                    }
                }
                return false;
            };

            return pictureGame;
        }
    ]);
