var _ = require('lodash');
var random = require('../utils/random.util.js');
var DeviceBase = require('./device.base.js');

module.exports = function(models) {
	this.models = models;
	this.devices = [];

	var self = this;

	this.callbacks = [];

	this.on = function(key, callback) {
		this.callbacks[key] = callback;
	};

	this.emit = function(key, params) {
		if (this.callbacks[key]) {
			this.callbacks[key](params);
		}
	}

	this.init = function(callback) {
		callback();
	}

	this.lowerDate = new Date();
	this.lowerDate.setHours(0);
	this.upperDate = new Date();
	this.upperDate.setHours(23);

	this.setDates = function(lowerDateString, upperDateString) {
		this.lowerDate = new Date(lowerDateString);
		this.upperDate = new Date(upperDateString);
	};

	this.doWork = function() {
		_.forEach(this.models, function(model) {
			var notifications = DeviceBase.generate(model, { lowerDate: self.lowerDate, upperDate: self.upperDate });
			self.emit('notify', notifications);
			self.emit('update', model);
		})
	};
}