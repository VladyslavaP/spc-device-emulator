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
	var lowerDate = req.params.lowerDate;
	var upperDate = req.params.upperDate;
	emulator.run(lowerDate, upperDate);
	return res.sendStatus(200);
})

router.get('/photo', function(req, res) {
	emulator.getPhoto(function(url) {
		return res.json(200, { url: url });
	});
})

var app = express();
app.use('/', router);

app.listen(env.PORT, function() {
	console.log('started emulator');
});