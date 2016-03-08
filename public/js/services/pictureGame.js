/**
 * Created by Raphaelle on 04/03/2016.
 */
angular.module('calliApp')

    .factory('pictureGame', ['$http', 'scenario',
        function($http, scenario){

            var pictureGame = {
                scenario: {},
                scenarioList: [ {
                    "name": "pictureSample",
                    "level": "1",
                    "conversation":[
                        {
                            "question": "Ceard is ainm do",
                            "position": "1",
                            "answers": [
                                {
                                    "answer": "Pól is ainm do",
                                    "branch": "2",
                                    "correct": true
                                },
                                {
                                    "answer": "Rici is ainm do",
                                    "branch": "2",
                                    "correct": false
                                },
                                {

                                    "answer": "Padraig is ainm do",
                                    "branch": "2",
                                    "correct": false

                                }
                            ]
                        },

                        {

                            "question": "Cen dath an bhfuil a geansai?",
                            "position": "2",
                            "answers": [
                                {
                                    "answer": "gorm",
                                    "branch": "3",
                                    "correct": true
                                },
                                {
                                    "answer": "ban",
                                    "branch": "3",
                                    "correct": false
                                },
                                {
                                    "answer": "dearg",
                                    "branch": "3",
                                    "correct": false
                                }
                            ]
                        },

                        {

                            "question": "Ceard ata ar an mballa",
                            "position": "3",
                            "answers": [
                                {
                                    "answer": "Ta clog ar an mballa",
                                    "branch": "4",
                                    "correct": true
                                },
                                {
                                    "answer": "Ta pictúir ar an mballa",
                                    "branch": "4",
                                    "correct": false
                                },
                                {
                                    "answer": "Ta clar dubh ar an mballa",
                                    "branch": "4",
                                    "correct": false
                                }
                            ]
                        },
                        {

                            "question": "An bhfaca tu fear sa pictúir?",
                            "position": "4",
                            "answers": [
                                {
                                    "answer": "Chonaic me fear sa pictúir",
                                    "branch": "5",
                                    "correct": true
                                },
                                {
                                    "answer": "Chonaic me bean sa pictúir",
                                    "branch": "5",
                                    "correct": false
                                }
                            ]
                        },
                        {

                            "question": "Ce mhead uachtar reoite ata sa pictúir",
                            "position": "5",
                            "answers": [
                                {
                                    "answer": "Ta ceithre uachtar reoite sa pictúir",
                                    "branch": "6",
                                    "correct": false
                                },
                                {
                                    "answer": "Ta tri uachtar reoite sa pictúir",
                                    "branch": "6",
                                    "correct": true
                                },
                                {
                                    "answer": "Ta cuig uachtar reoite sa pictúir",
                                    "branch": "6",
                                    "correct": false
                                }
                            ]
                        },
                        {

                            "question": "Ceard ata ar an mbord",
                            "position": "6",
                            "answers": [
                                {
                                    "answer": "Ta cupan ar an mbord",
                                    "branch": "7",
                                    "correct": true
                                },
                                {
                                    "answer": "Ta milsean ar an mbord",
                                    "branch": "7",
                                    correct: false
                                },
                                {
                                    "answer": "Ta malla ar an mbord",
                                    "branch": "7",
                                    "correct": false
                                }
                            ]
                        },
                        {

                            "question": "Ce mhead caca milis ata sa pictúir",
                            "position": "7",
                            "answers": [
                                {
                                    "answer": "Ta seacht caca milis sa pictúir",
                                    "branch": "0",
                                    "correct": false
                                },
                                {
                                    "answer": "Ta do caca milis sa pictúir",
                                    "branch": "0",
                                    "correct": true
                                },
                                {
                                    "answer": "Ta se caca milis sa pictúir",
                                    "branch": "0",
                                    "correct": false
                                }
                            ]
                        }

                    ]} ],
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
                var question = this.scenario.conversation[this.position - 1];
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

                console.log(pictureGame.scenarioList);
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
