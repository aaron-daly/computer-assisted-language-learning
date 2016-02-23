// server.js

// modules =================================================
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var express = require('express');
var mongoose = require('mongoose');

var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var session = require('express-session');

// configuration ===========================================
var app = express();


var db = require('./config/db');
var port = process.env.PORT || 8080;
mongoose.connect(db.url);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

//passport
app.use(session({ secret: 'calliwins' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes ==================================================
require('./app/routes')(app, passport); // configure our routes

// start app ===============================================
app.listen(port); //port 8080
console.log('Magic happens on port ' + port);
exports = module.exports = app;