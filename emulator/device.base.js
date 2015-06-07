var random = require('../utils/random.util.js');
var env = require('../env.js');
var _ = require('lodash');

var fs = require('fs');

var alterations = {
	waterModule: function(waterModule) {
		waterModule.currentWaterAmount -= env.deviceBase.WATER_CONSUMPTION;
		if (waterModule.currentWaterAmount < waterModule.minimalWaterAmount) {
			waterModule.currentWaterAmount = env.deviceBase.MAX_WATER_AMOUNT;
			return { message: env.messages.waterShortage };
		};
	},
	foodModule: function(foodModule) {
		foodModule.currentFoodAmount -= foodModule.foodDailyRation;
		if (foodModule.currentFoodAmount < foodModule.minimalFoodAmount) {
			foodModule.currentFoodAmount = env.deviceBase.MAX_FOOD_AMOUNT;
			return { message: env.messages.foodShortage };
		};
	},
	sprayingModule: function(sprayingModule) {
		sprayingModule.currentSprayingMaterialAmount -= sprayingModule.sprayAmount;
		if (sprayingModule.currentSprayingMaterialAmount < sprayingModule.sprayAmount) {
			sprayingModule.currentSprayingMaterialAmount = env.deviceBase.MAX_SPRAYER_AMOUNT;
			return { message: env.messages.sprayingMaterialShortage };
		}
	},
	irrigationModule: function(irrigationModule) {
		irrigationModule.currentWaterAmount -= irrigationModule.waterPortion;
		if (irrigationModule.currentWaterAmount < env.deviceBase.MAX_WATER_AMOUNT) {
			irrigationModule.currentWaterAmount = env.deviceBase.MAX_WATER_AMOUNT;
			return { message: env.messages.waterShortage };
		}
	}
}

module.exports = function(deviceModel) {
	this.model = deviceModel;
	var self = this;

	this.generate = function() {
		var notifications = [];
		_.forEach(alterations, function(alter, module) {
			if (self.model.config[module] === undefined) { return; }
			var notification = alter(self.model.config[module]);
			if (notification) {
				notifications.push(notification);
			}
		});
		return notifications;
	}
};