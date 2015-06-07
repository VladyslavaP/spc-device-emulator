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
	request({
		method: 'POST',
		url: env.api.updateDeviceUrl,
		data: model
	})
	.success(function() {
		console.log('updated ' + model.name);
	});
}