/**
 * Created by Dalyy on 22/02/2016.
 */
var mongoose = require('mongoose');

var ConversationScenarioSchema = new mongoose.Schema({

    name: {type: String, required: true},
    level: Number,
    conversation: [{
        question: String,
        translation: String,
        position: Number,
        answers: [{
            answer: String,
            translation: String,
            branch: Number
        }]
    }]

});

module.exports = mongoose.model('ConversationScenario', ConversationScenarioSchema);

/* EXAMPLE ----------------------------
var sweetshop = {
    "name": "sweetshop",
    "level": 1,
    "questions":[
        {
            "question": "How are you?",
            "position": 1,
            "answers": [
                {
                    "answer": "I am good",
                    "branch": 2
                },
                {
                    "answer": "I am not well",
                    "branch": 3
                },
                {
                    "answer": "idk",
                    "branch": 0
                }
            ]
        },

        {
            "question": "That's good, would you like sweets?",
            "position": 2,
            "answers": [
                {
                    "answer": "Yes",
                    "branch": 4
                },
                {
                    "answer": "No",
                    "branch": 0
                }
            ]
        },

        {
            "question": "Oh no, would you like some sweets?",
            "position": 3,
            "answers": [
                {
                    "answer": "yes",
                    "branch": 4
                },
                {
                    "answer": "no",
                    "branch": 0
                }
            ]
        },
        {
            "question": "What sweets would you like?",
            "position": 4,
            "answers": [
                {
                    "answer": "chocolate",
                    "branch": 0
                },
                {
                    "answer": "bonbons",
                    "branch": 0
                }
            ]
        }

    ]
};
*/