/**
 * Created by Dalyy on 22/02/2016.
 */
var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({

    question: String,
    answers: [{}]

});