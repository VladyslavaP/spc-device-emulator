var random = require('../utils/random.util.js');
var env = require('../env.js');
var _ = require('lodash');

var cycle = function(initialValue, maxValue, consumption, offset, threshold, cycles) {
	var activeCycles = [];
	var consumedPerCycle = [];

	for (var i = 0; i < cycles; i++) {
		if (initialValue <= threshold) {
			activeCycles.push(i);
			initialValue = maxValue;
		} else {
			var consumed = random.blurValue(consumption, offset);
			consumedPerCycle.push(consumed);
			initialValue -= consumed;
		}
	}

	return {
		consumedPerCycle: consumedPerCycle,
		resultValue: initialValue,
		activeCycles: activeCycles
	};
}

var cyclesNumber = function(timeRange, period) {
	var diff = Math.floor((timeRange.upperDate - timeRange.lowerDate) / 1000 ); // hours in timeRange
	var cycles = Math.floor(diff / period);
	return cycles;
};

var getNotificationDates = function(lowerDate, activeCycles, period) {
	var dates = [];
	var currentTime = new Date(lowerDate);
	for(var i = 0; i < activeCycles.length - 1; i++) {
		currentTime.setSeconds(currentTime.getSeconds() + (activeCycles[i + 1] - activeCycles[i]) * period);
		dates.push(new Date(currentTime));
	};
	console.log('dates');
	console.log(dates);
	return dates;
};

var getNotifications = function(dates, deviceId, message) {
	var notifications = [];
	_.forEach(dates, function(date) {
		notifications.push({
			deviceId: deviceId,
			message: message,
			time: date
		});
	});
	console.log('notications');
	console.log(notifications.length);
	return notifications;
}

var getConsumptionNotifications = function(consumedPerCycle, period, lowerDate) {
	
}

var activities = {
	pets : function(model, timeRange) {
		var notifications = [];

		var feedingPeriod = (24 / random.blurValue(6, 30)) * 60 * 60; // seconds
		var feedingCycles = cyclesNumber(timeRange, feedingPeriod);
		var emulated = cycle(
			model.config.foodModule.currentFoodAmount,
			env.deviceBase.MAX_FOOD_AMOUNT,
			50,
			30,
			model.config.foodModule.foodAmountThreshold,
			feedingCycles
		);
		var feedingNotifications = getNotifications(
			getNotificationDates(timeRange.lowerDate, emulated.activeCycles, feedingPeriod),
			model._id,
			env.messages.foodShortage
		);
		notifications = notifications.concat(feedingNotifications);
		model.config.foodModule.currentFoodAmount = emulated.resultValue;

		var drinkingPeriod = (24 / random.blurValue(8, 25)) * 60 * 60; // seconds
		var drinkingCycles = cyclesNumber(timeRange, drinkingPeriod);
		emulated = cycle(
			model.config.waterModule.currentWaterAmount,
			env.deviceBase.MAX_WATER_AMOUNT,
			20,
			10,
			model.config.waterModule.waterAmountThreshold,
			drinkingCycles
		);
		var drinkingNotifications = getNotifications(
			getNotificationDates(timeRange.lowerDate, emulated.activeCycles, drinkingPeriod),
			model._id,
			env.messages.waterShortage
		);
		notifications = notifications.concat(drinkingNotifications);
		model.config.waterModule.currentWaterAmount = emulated.resultValue;
		console.log('changed model: ');
		console.log(model.config.foodModule);
		console.log(model.config.waterModule);
		return notifications;
	},
	plants: function(model, timeRange) {

	},
	fishes: function(model, timeRange) {

	}
}

exports.generate = function(deviceModel, timeRange) {
	return activities[deviceModel.type](deviceModel, timeRange);
};