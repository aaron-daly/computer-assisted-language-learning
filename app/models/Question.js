/**
 * Created by Dalyy on 22/02/2016.
 */
var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({

    question: String,
    translation: String,
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}]

});

mongoose.model('Question', QuestionSchema);