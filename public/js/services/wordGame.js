/**
 * Created by Raphaelle on 07/03/2016.
 */
angular.module('calliApp')

    .factory('wordGame', ['$http', 'scenario',
        function($http, scenario){

            var wordGameExample =                     {
                "name": "wordSample",
                "level": 1,
                "conversation":[
                    {
                        "question": "Is maith liom ",
                        "position": 1,
                        "answers": [
                            {
                                "answer": "seaclaid",
                                "branch": 2,
                                "correct": false
                            },
                            {
                                "answer": "brioscai",
                                "branch": 2,
                                "correct": true
                            },
                            {
                                "answer": "caca milis",
                                "branch": 2,
                                "correct": false
                            }
                        ]
                    },

                    {
                        "question": "Is fearr liom ",
                        "position": 2,
                        "answers": [
                            {
                                "answer": "seaclaid",
                                "branch": 3,
                                "correct": true
                            },
                            {
                                "answer": "criospai",
                                "branch": 3,
                                "correct": false
                            },
                            {
                                "answer": "milsean",
                                "branch": 3,
                                "correct": false
                            }
                        ]
                    },

                    {
                        "question": "D'ith me ",
                        "position": 3,
                        "answers": [
                            {
                                "answer": "bainne",
                                "branch": 4,
                                "correct": false
                            },
                            {
                                "answer": "caca milis",
                                "branch": 4,
                                "correct": true
                            },
                            {
                                "answer": "uisce",
                                "branch": 4,
                                "correct": false
                            }
                        ]
                    },
                    {
                        "question": "Thug siad  ",
                        "position": 4,
                        "answers": [
                            {
                                "answer": "uachtar reoite",
                                "branch": 5,
                                "correct": true
                            },
                            {
                                "answer": "bonbons",
                                "branch": 5,
                                "correct": false
                            },
                            {
                                "answer": "criospai",
                                "branch": 5,
                                "correct": false
                            }
                        ]
                    },
                    {
                        "question": "Ni raibh me ag ithe ",
                        "position": 5,
                        "answers": [
                            {
                                "answer": "uachtar reoite",
                                "branch": 6,
                                "correct": false
                            },
                            {
                                "answer": "bonbons",
                                "branch": 6,
                                "correct": false
                            },
                            {
                                "answer": "criospai",
                                "branch": 6,
                                "correct": true
                            }
                        ]
                    },
                    {
                        "question": "Pioc me alan",
                        "position": 6,
                        "answers": [
                            {
                                "answer": "uachtar reoite",
                                "branch": 7,
                                "correct": false
                            },
                            {
                                "answer": "milsean",
                                "branch": 7,
                                "correct": true
                            },
                            {
                                "answer": "criospai",
                                "branch": 7,
                                "correct": false
                            }
                        ]
                    },
                    {
                        "question": "Bhi pol ag ol ",
                        "position": 7,
                        "answers": [
                            {
                                "answer": "uachtar reoite",
                                "branch": 0,
                                "correct": false
                            },
                            {
                                "answer": "bainne",
                                "branch": 0,
                                "correct": true
                            },
                            {
                                "answer": "criospai",
                                "branch": 0,
                                "correct": false
                            }
                        ]
                    }
                ]
            };

            var wordGame = {
                scenario: {},
                scenarioList: [],
                position: 1,
                recordedQuestions: [],
                recordedAnswers: [],
                recordedCorrectAnswers: [],
                isPlaying: false
            };

            //initiate game, callback first question
            wordGame.initGame = function(callback) {

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
            wordGame.tick = function(answer, callback) {
                    this.recordedAnswers.push(answer.answer);

                    //answer,branch,correct of current answer.
                    var currentAnswers = wordGame.scenario.conversation[wordGame.position-1].answers;

                    $.each(currentAnswers, function(key, val) {
                        if(val.answer == answer.answer) {
                            wordGame.recordedCorrectAnswers.push(val.correct);
                        }
                    });

                this.position++;
                //if we reach delimiter position 0, callback results and release game
                if(this.position >= this.scenario.conversation.length) {
                    callback(this.getResults());
                    this.release();
                } else {
                    //update position and callback next question
                    this.position++;
                    callback(this.nextQuestion());
                }

            };

            //results of questions and answers
            wordGame.getResults = function() {
                return {
                    questions: this.recordedQuestions,
                    answers: this.recordedAnswers,
                    correct: this.recordedCorrectAnswers
                }
            };

            //release game data
            wordGame.release = function() {
                this.scenario = {};
                this.position = 1;
                this.recordedQuestions = [];
                this.recordedAnswers = [];
                this.recordedCorrectAnswers = [];
            };

            //load question of game's current position
            wordGame.nextQuestion = function() {
                var question = this.scenario.conversation[this.position - 1];
                this.recordedQuestions.push(question.question);
                return question;
            };

            //loaf scenario for the game
            wordGame.loadScenario = function(scenarioName, callback) {

                var i = 0;
                var len = wordGame.scenarioList.length;
                var data = {};

                for(i; i < len; i++) {
                    if(wordGame.scenarioList[i].name === scenarioName) {
                        data = wordGame.scenarioList[i];
                        angular.copy(data, wordGame.scenario);
                        callback(data);
                    }
                }

            };

            //preloads games into scenarioList
            wordGame.preload = function() {

                scenario.getWordScenarios(function(data) {
                    if(wordGame.scenarioList.length == 0){
                        $.each(data, function(key, scenario) {
                            wordGame.scenarioList.push(scenario);
                        })
                    }
                });
            };

            //return array of names of scenarios in scenarioList
            wordGame.scenarioListNames = function() {
                var arr = [];
                var i = 0;
                var len = wordGame.scenarioList.length;

                for(i; i < len; i++) {
                    arr.push(wordGame.scenarioList[i].name);
                }

                return arr;
            };

            wordGame.containsScenario = function(scenarioName) {
                if(wordGame.scenarioList) {
                    var i = 0;
                    var len = wordGame.scenarioList.length;
                    for(i; i<len; i++) {
                        if(wordGame.scenarioList[i].name === scenarioName) {
                            return true;
                        }
                    }
                }
                return false;
            };

            return wordGame;
        }
    ]);
