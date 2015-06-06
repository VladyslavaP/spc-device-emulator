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
}