
angular.module('calliApp')

    .factory('game', ['$http', 'scenario',
        function($http, scenario){

            var game = {
                scenario: {},
                scenarioList: {},
                position: 1,
                recordedQuestions: [],
                recordedAnswers: [],
                isPlaying: false
            };

            //initiate game, callback first question
            game.initGame = function(type, scenarioName, callback) {

                if(this.isPlaying) {
                    callback('Game in progress');
                    return;
                }

                this.isPlaying = true;
                var firstQuestion = {};

                //load scenario, callback first question....
                this.loadScenario(type, scenarioName, function(conv) {
                    firstQuestion = game.loadQuestion();
                    callback(firstQuestion);
                });
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
                    callback(this.loadQuestion());
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
            game.loadQuestion = function() {
                var question = this.scenario.conversation[this.position - 1];
                this.recordedQuestions.push(question.question);
                return question;
            };

            //loaf scenario for the game
            game.loadScenario = function(type, scenarioName, callback) {
                scenario.get(type, scenarioName, function(data) {
                    angular.copy(data, game.scenario);
                    callback(data);
                });
            };



            return game;
        }
    ]);
