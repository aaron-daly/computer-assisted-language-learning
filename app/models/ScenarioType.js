/**
 * Created by Aaron on 10/03/2016.
 */
var mongoose = require('mongoose');

var ScenarioTypeSchema = new mongoose.Schema({

    scenarioType: Number,
    name: String

});

module.exports = mongoose.model('ScenarioType', ScenarioTypeSchema);