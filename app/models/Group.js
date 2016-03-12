
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({

    teacherId: { type: String, required: true },
    scenarios: [{
        scenarioId: { type: mongoose.Schema.Types.ObjectId },
        scenarioName: String,
        scenarioType: String,
        scenarioLevel: Number,
        completionList: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
        translations: Boolean,
        enabled: Boolean
    }]

});

module.exports = mongoose.model('Group', GroupSchema);