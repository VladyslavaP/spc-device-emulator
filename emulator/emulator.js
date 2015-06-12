var api = require('../utils/api.util.js');
var DeviceManager = require('./device.manager.js');
var _ = require('lodash');


module.exports = function() {
	this.manager = {};

	var self = this;

	this.init = function(callback) {
		api.getDeviceModels(function(models) {
			self.manager = new DeviceManager(models);
			self.manager.on('notify', api.postNotifications);
			self.manager.on('update', api.updateDevice);
			self.manager.on('stats', api.sendStats);
			callback();
		});
	};

	this.run = function(lowerDateString, upperDateString) {
		if (!this.manager) {
			return;
		}
		self.manager.setDates(lowerDateString, upperDateString);
		this.manager.doWork();
	};
};