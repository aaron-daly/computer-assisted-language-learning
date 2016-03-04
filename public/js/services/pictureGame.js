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
            pictureGame.getResults = function() {  //pictureGame needs to be blue
                return {
                    questions: this.recordedQuestions,
                    answers: this.recordedAnswers
                }
            };

            //release game data
            pictureGame.release = function() {
                this.scenario = {};
                this.position = 1;
                this.recordedQuestions = [];
                this.recordedAnswers = [];
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
            picureGame.preload = function() {

                console.log(pictureGame.scenarioList);
                scenario.getConversationScenarios(function(data) {
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

            return pictureGame;
        }
    ]);
