
angular.module('calliApp')

    .factory('conversationGame', ['$http', 'scenario',
        function($http, scenario){

            var conversationGame = {
                scenario: {},
                scenarioList: [ {
                    "name": "conversationSample",
                    "level": "1",
                    "conversation":[
                        {
                            "question": "Hi, how are you?",
                            "position": "1",
                            "answers": [
                                {
                                    "answer": "sweetshop",
                                    "branch": "2"
                                },
                                {
                                    "answer": "library",
                                    "branch": "2"
                                },
                                {

                                    "answer": "ospideal",
                                    "branch": "2"

                                }
                            ]
                        },

                        {

                            "question": "is the shop keeper male or female?",
                            "position": "2",
                            "answers": [
                                {
                                    "answer": "male",
                                    "branch": "3"
                                },
                                {
                                    "answer": "female",
                                    "branch": "3"
                                },
                                {
                                    "answer": "i dont understand",
                                    "branch": "3"
                                }
                            ]
                        },

                        {

                            "question": "how many chocolate bars?",
                            "position": "3",
                            "answers": [
                                {
                                    "answer": "4",
                                    "branch": "4"
                                },
                                {
                                    "answer": "3",
                                    "branch": "4"
                                },
                                {
                                    "answer": "2",
                                    "branch": "4"
                                }
                            ]
                        },
                        {

                            "question": "how many cakes",
                            "position": "4",
                            "answers": [
                                {
                                    "answer": "1",
                                    "branch": "0"
                                },
                                {
                                    "answer": "3",
                                    "branch": "0"
                                },
                                {
                                    "answer": "2",

                                    "branch": "0"
                                }
                            ]
                        }

                ]} ],
                position: 1,
                recordedQuestions: [],
                recordedAnswers: [],
                isPlaying: false
            };

            //initiate game, callback first question
            conversationGame.initGame = function(callback) {

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
            conversationGame.tick = function(answer, callback) {

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
            conversationGame.getResults = function() {
                return {
                    questions: this.recordedQuestions,
                    answers: this.recordedAnswers
                }
            };

            //release game data
            conversationGame.release = function() {
                this.scenario = {};
                this.position = 1;
                this.recordedQuestions = [];
                this.recordedAnswers = [];
            };

            //load question of game's current position
            conversationGame.nextQuestion = function() {
                var question = this.scenario.conversation[this.position - 1];
                this.recordedQuestions.push(question.question);
                return question;
            };

            //loaf scenario for the game
            conversationGame.loadScenario = function(scenarioName, callback) {

                var i = 0;
                var len = conversationGame.scenarioList.length;
                var data = {};

                for(i; i < len; i++) {
                    if(conversationGame.scenarioList[i].name === scenarioName) {
                        data = conversationGame.scenarioList[i];
                        angular.copy(data, conversationGame.scenario);
                        callback(data);
                    }
                }

            };

            //preloads games into scenarioList
            conversationGame.preload = function() {

                console.log(conversationGame.scenarioList);
                scenario.getConversationScenarios(function(data) {
                    if(conversationGame.scenarioList.length == 0){
                        $.each(data, function(key, scenario) {
                            conversationGame.scenarioList.push(scenario);
                        })
                    }
                });
            };

            //return array of names of scenarios in scenarioList
            conversationGame.scenarioListNames = function() {
                var arr = [];
                var i = 0;
                var len = conversationGame.scenarioList.length;

                for(i; i < len; i++) {
                    arr.push(conversationGame.scenarioList[i].name);
                }

                return arr;
            };

            return conversationGame;
        }
    ]);
