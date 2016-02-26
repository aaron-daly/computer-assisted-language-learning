/**
 * Created by Dalyy on 25/02/2016.
 */
var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({

    answer: String,
    translation: String,
    proceedingQuestion: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'}

});

mongoose.model('Answer', AnswerSchema);