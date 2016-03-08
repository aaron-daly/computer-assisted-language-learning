/**
 * Created by Aaron on 03/03/2016.
 */
var mongoose = require('mongoose');

var PictureScenarioSchema = new mongoose.Schema({

    name: {type: String, unique: true, required: true},
    level: Number,
    conversation: [{
        question: String,
        translation: String,
        position: Number,
        answers: [{
            answer: String,
            translation: String,
            correct: Boolean
        }]
    }]

});


module.exports = mongoose.model('PictureScenario', PictureScenarioSchema);
