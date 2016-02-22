/**
 * Created by Dalyy on 22/02/2016.
 */
var mongoose = require('mongoose');

var ScenarioSchema = new mongoose.Schema({

    name: {type: String, unique: true, required: true},
    level: Number,
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});

mongoose.model('Scenario', ScenarioSchema);