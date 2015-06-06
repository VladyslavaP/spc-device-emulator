var api = require('../utils/api.util.js');
var DeviceMedia = require('./device.media.js');
var DeviceManager = require('./device.manager.js');
var _ = require('lodash');


module.exports = function() {
	this.manager = {};

	var self = this;

	this.init = function(callback) {
		api.getDeviceModels(function(models) {
			self.manager = new DeviceManager(models);
			self.manager.init(function() {
				self.manager.on('notify', api.sendNotifications);
				self.manager.on('update', api.updateDevice);
				callback();
			});
		});
	};

	this.run = function(lowerDateString, upperDateString) {
		if (!this.manager) {
			return;
		}
		self.manager.setDates(lowerDateString, upperDateString);
		this.manager.doWork();
	}

	this.media = new DeviceMedia();

	this.getPhoto = function(callback) {
  		this.media.getRandomPhoto(function(url) {
			callback(url);
		});
	};
}