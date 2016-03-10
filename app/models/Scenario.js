/**
 * Created by Aaron on 10/03/2016.
 */
var mongoose = require('mongoose');

var ScenarioSchema = new mongoose.Schema({

    name: {type: String, required: true},
    level: Number,
    scenarioType:
    {
        id: mongoose.Schema.Types.ObjectId,
        name: String
    },
    conversation: [
        {
            question: String,
            translation: String,
            answers: [
                {
                    answer: String,
                    translation: String,
                    correct: Boolean
                }
            ]
        }
    ]

});


module.exports = mongoose.model('Scenario', ScenarioSchema);
