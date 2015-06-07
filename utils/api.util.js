var request = require('request');
var env = require('../env.js');

exports.getDeviceModels = function(callback) {
	request(env.api.getDevicesUrl, function(err, response, body) {
		callback(JSON.parse(body));
	});
};

exports.postNotifications = function(notifications) {
	_.forEach(notifications, function(notification) {
		request.post({
			url: env.api.postNotificationUrl,
			form: notification
		});
	});
};

exports.updateDevice = function(model) {
	console.log(model);
	request.post({
		url: env.api.updateDeviceUrl,
		form: model
	})
	.on('response', function(res) {
		if(res.statusCode !== 200) {
			console.log('gg wp');
			console.log(res.body);
		} else {
			console.log('updated ' + model.name);
		}
	});
}