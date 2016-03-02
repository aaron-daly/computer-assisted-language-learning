
angular.module('calliApp')

    .factory('game', ['$http', 'scenario',
        function($http, scenario){

            var game = {
                scenario: {},
                scenarioList: [],
                position: 1,
                recordedQuestions: [],
                recordedAnswers: [],
                isPlaying: false
            };

            //initiate game, callback first question
            game.initGame = function(callback) {

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
            game.tick = function(answer, callback) {

                this.recordedAnswers.push(answer.answer);

                //if we reach delimiter position 0, callback results and release game
                if(answer.branch == 0) {
                    callback(this.getResults());
                    this.release();
                } else {

                    //update position and callback next question
                    this.position = answer.branch;
                    callback(this.nextQuestion());
                }

            };

            //results of questions and answers
            game.getResults = function() {
                return {
                    questions: this.recordedQuestions,
                    answers: this.recordedAnswers
                }
            };

            //release game data
            game.release = function() {
                this.scenario = {};
                this.position = 1;
                this.recordedQuestions = [];
                this.recordedAnswers = [];
            };

            //load question of game's current position
            game.nextQuestion = function() {
                var question = this.scenario.conversation[this.position - 1];
                this.recordedQuestions.push(question.question);
                return question;
            };

            //loaf scenario for the game
            game.loadScenario = function(scenarioName, callback) {

                var i = 0;
                var len = game.scenarioList.length;
                var data = {};

                for(i; i < len; i++) {
                    if(game.scenarioList[i].name === scenarioName) {
                        data = game.scenarioList[i];
                        angular.copy(data, game.scenario);
                        callback(data);
                    }
                }

            };

            //preloads games into scenarioList
            game.preload = function() {
                scenario.getAll(function(data) {
                    if(game.scenarioList.length == 0){
                        $.each(data, function(key, scenario) {
                            game.scenarioList.push(scenario);
                        })
                    }
                });
            };

            //return array of names of scenarios in scenarioList
            game.scenarioListNames = function() {
                var arr = [];
                var i = 0;
                var len = game.scenarioList.length;

                for(i; i < len; i++) {
                    arr.push(game.scenarioList[i].name);
                }

                return arr;
            };

            return game;
        }
    ]);
