/**
 * Created by Raphaelle on 07/03/2016.
 */
angular.module('calliApp')

    .factory('wordGame', ['$http', 'scenario',
        function($http, scenario){

            var wordGame = {
                scenario: {},
                scenarioList: [ {
                    "name": "wordSample",
                    "level": "1",
                    "conversation":[
                            {
                                "question": "Is maith liom ",
                                "position": "1",
                                "answers": [
                                    {
                                        "answer": "seaclaid",
                                        "branch": "2"
                                    },
                                    {
                                        "answer": "brioscai",
                                        "branch": "2"
                                    },
                                    {
                                        "answer": "caca milis",
                                        "branch": "2"
                                    }
                                ]//end "answers"
                            },

                        {
                            "question": "Is fearr liom ",
                            "position": "2",
                            "answers": [
                                {
                                    "answer": "seaclaid",
                                    "branch": "3"
                                },
                                {
                                    "answer": "criospai",
                                    "branch": "3"
                                },
                                {
                                    "answer": "milsean",
                                    "branch": "3"
                                }
                            ] //end "answers"
                        },

                        {
                            "question": "D'ith me ",
                            "position": "3",
                            "answers": [
                                {
                                    "answer": "bainne",
                                    "branch": "4"
                                },
                                {
                                    "answer": "caca milis",
                                    "branch": "4"
                                },
                                {
                                    "answer": "uisce",
                                    "branch": "4"
                                }
                            ] //end "answers"
                        },
                        {
                            "question": "Thug siad  ",
                            "position": "4",
                            "answers": [
                                {
                                    "answer": "uachtar reoite",
                                    "branch": "5"
                                },
                                {
                                    "answer": "bonbons",
                                    "branch": "5"
                                },
                                {
                                    "answer": "criospai",
                                    "branch": "5"
                                }
                            ] //end "answers"
                        },
                        {
                            "question": "Ni raibh me ag ithe ",
                            "position": "5",
                            "answers": [
                                {
                                    "answer": "uachtar reoite",
                                    "branch": "6"
                                },
                                {
                                    "answer": "bonbons",
                                    "branch": "6"
                                },
                                {
                                    "answer": "criospai",
                                    "branch": "6"
                                }
                            ] //end "answers"
                        },
                        {
                            "question": "Pioc me alan",
                            "position": "6",
                            "answers": [
                                {
                                    "answer": "uachtar reoite",
                                    "branch": "7"
                                },
                                {
                                    "answer": "milsean",
                                    "branch": "7"
                                },
                                {
                                    "answer": "criospai",
                                    "branch": "7"
                                }
                            ] //end "answers"
                        },
                        {
                            "question": "Bhi pol ag ol ",
                            "position": "7",
                            "answers": [
                                {
                                    "answer": "uachtar reoite",
                                    "branch": "0"
                                },
                                {
                                    "answer": "bainne",
                                    "branch": "0"
                                },
                                {
                                    "answer": "criospai",
                                    "branch": "0"
                                }
                            ] //end "answers"
                        }

                    //end "questions"

                    ]} ],
                position: 1,
                recordedQuestions: [],
                recordedAnswers: [],
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
            wordGame.getResults = function() {
                return {
                    questions: this.recordedQuestions,
                    answers: this.recordedAnswers
                }
            };

            //release game data
            wordGame.release = function() {
                this.scenario = {};
                this.position = 1;
                this.recordedQuestions = [];
                this.recordedAnswers = [];
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

                console.log(wordGame.scenarioList);
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

            return wordGame;
        }
    ]);
