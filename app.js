var Emulator = require('./emulator/emulator.js');
var express = require('express');
var env = require('./env.js');
var mongoose = require('mongoose');

var router = express.Router();

var emulator = new Emulator();
emulator.init(function() {
	console.log('haha hoho manager in da house');
});

router.get('/emulate', function(req, res) {
	var lowerDate = req.query.lowerDate;
	var upperDate = req.query.upperDate;
	emulator.run(lowerDate, upperDate);
	return res.sendStatus(200);
});

var app = express();
app.use('/', router);

app.listen(env.PORT, function() {
	console.log('started emulator');
});