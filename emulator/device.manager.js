var _ = require('lodash');
var random = require('../utils/random.util.js');
var DeviceBase = require('./device.base.js');

module.exports = function(models) {
	this.models = models;
	this.devices = [];

	var self = this;

	this.init = function() {
		_.forEach(this.models, function(model) {
			self.devices.push(new DeviceBase(model));
		});
	}

	this.lowerDate = new Date();
	this.lowerDate.setHours(0);
	this.upperDate = new Date();
	this.upperDate.setHours(23);

	this.setDates = function(lowerDateString, upperDateString) {
		this.lowerDate = new Date(lowerDateString);
		this.upperDate = new Date(upperDateString);
	}

	this.doWork = function() {
		_.forEach(this.devices, function(device) {
			var notifications = device.generate();
			notifications = _.map(notifications, function(n) {
				n.time = random.randomTimeInRange(this.lowerDate, this.upperDate);
				return n;
			});
			message.sendNotifications(notifications);
			message.updateModel(device.model);
		})
	}
}