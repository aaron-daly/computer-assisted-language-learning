/**
 * Created by Aaron on 24/02/2016.
 */
var mongoose = require('mongoose');

var RoleSchema = new mongoose.Schema({
    type: String,
    permission: Number
});

module.exports = mongoose.model('Role', RoleSchema);