
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
                            "question": "Dia dhuit",
                            "position": "1",
                            "answers": [
                                {
                                    "answer": "Dia is muire dhuit",
                                    "branch": "2"
                                }
                            ]
                        },

                        {

                            "question": "An raibh tú ar scoil innú?",
                            "position": "2",
                            "answers": [
                                {
                                    "answer": "Bhi me ar scoil innú",
                                    "branch": "3"
                                },
                                {
                                    "answer": "Ni raibh me ar scoil innú",
                                    "branch": "3"
                                }
                            ]
                        },

                        {

                            "question": "An maith leat milsean?",
                            "position": "3",
                            "answers": [
                                {
                                    "answer": "Is maith liom milsean",
                                    "branch": "4"
                                },
                                {
                                    "answer": "Ni maith liom milsean",
                                    "branch": "5"
                                },
                                {
                                    "answer": "Is fearr liom seacloid",
                                    "branch": "6"
                                }
                            ]
                        },
                        {

                            "question": "Cen milsean ar mhaith leat?",
                            "position": "4",
                            "answers": [
                                {
                                    "answer": "sealaid",
                                    "branch": "6"
                                },
                                {
                                    "answer": "uachtar reoite",
                                    "branch": "6"
                                },
                                {
                                    "answer": "criospai",
                                    "branch": "6"
                                }
                            ]
                        },
                        {

                            "question": "Ar ól tú cóc?",
                            "position": "5",
                            "answers": [
                                {
                                    "answer": "Nior ól me cóc",
                                    "branch": "6"
                                },
                                {
                                    "answer": "D'ól me cóc",
                                    "branch": "6"
                                },
                                {
                                    "answer": "Is fearr liom bainne",
                                    "branch": "6"
                                }
                            ]
                        },
                        {

                            "question": "Seo duit, Ar mhaith leat mala?",
                            "position": "6",
                            "answers": [
                                {
                                    "answer": "Nil, Ta mala agam",
                                    "branch": "7"
                                },
                                {
                                    "answer": "Ta, nil mala agam",
                                    "branch": "7"
                                },
                                {
                                    "answer": "Is feider liom iad a ithe anois",
                                    "branch": "7"
                                }
                            ]
                        },
                        {

                            "question": "Go raibh maith agat, slan",
                            "position": "7",
                            "answers": [
                                {
                                    "answer": "Slan",
                                    "branch": "0"
                                },
                                {
                                    "answer": "Go raibh maith agat",
                                    "branch": "0"
                                },
                                {
                                    "answer": "Slan go fól",
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
                        });
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

            conversationGame.containsScenario = function(scenarioName) {
                if(conversationGame.scenarioList) {
                    var i = 0;
                    var len = conversationGame.scenarioList.length;
                    for(i; i<len; i++) {
                        if(conversationGame.scenarioList[i].name === scenarioName) {
                            return true;
                        }
                    }
                }
                return false;
            };

            return conversationGame;
        }
    ]);
