var random = require('../utils/random.util.js');
var env = require('../env.js');
var _ = require('lodash');

var fs = require('fs');

var alterations = {
	waterModule: function(waterModule) {
		waterModule.currentWaterAmount -= env.deviceBase.WATER_CONSUMPTION;
		if (waterModule.currentWaterAmount < waterModule.minimalWaterAmount) {
			waterModule.currentWaterAmount = env.deviceBase.MAX_WATER_AMOUNT;
			return { notification : { message: env.messages.waterShortage }};
		};
	},
	foodModule: function(foodModule) {
		foodModule.currentFoodAmount -= foodModule.foodDailyRation;
		if (foodModule.currentFoodAmount < foodModule.minimalFoodAmount) {
			foodModule.currentFoodAmount = env.deviceBase.MAX_FOOD_AMOUNT;
			return { notification : { message: env.messages.foodShortage }};
		};
	},
	sprayingModule: function(sprayingModule) {
		sprayingModule.currentSprayingMaterialAmount -= sprayingModule.sprayAmount;
		if (sprayingModule.currentSprayingMaterialAmount < sprayingModule.sprayAmount) {
			sprayingModule.currentSprayingMaterialAmount = env.deviceBase.MAX_SPRAYER_AMOUNT;
			return { notification: { message: env.messages.sprayingMaterialShortage }};
		}
	}
}

module.exports = function(deviceModel) {
	this.model = deviceModel.toObject();
	var self = this;


	this.generate = function() {
		var notifications = [];
		_.forEach(alterations, function(alter, module) {
			var notification = alter(this.model[module]);
			if (notification) {
				notifications.push(notification);
			}
		});
		return notifications;
	}
};