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
};

var cyclesNumber = function(timeRange, period) {
	var diff = Math.floor((timeRange.upperDate - timeRange.lowerDate) / 1000 ); // hours in timeRange
	var cycles = Math.floor(diff / period);
	return cycles;
};

var getNotificationDates = function(lowerDate, activeCycles, period) {
	var dates = [];
	var currentTime = new Date(lowerDate);
	for(var i = 0; i < activeCycles.length - 1; i++) {
		currentTime.setSeconds(
			currentTime.getSeconds() + (activeCycles[i + 1] - activeCycles[i]) * period
		);
		dates.push(new Date(currentTime));
	};
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
	return notifications;
}

var getDatesByPeriod = function(lowerDate, period, number) {
	var dates = [];
	var startDate = new Date(lowerDate);
	for (var i = 0; i < number; i++) {
		startDate.setSeconds(startDate.getSeconds() + period);
		dates.push(new Date(startDate));
	}
	return dates;
}

var getConsumptionStats = function(consumedPerCycle, dates, deviceId, type) {
	var stats = [];
	_.forEach(consumedPerCycle, function(value, i) {
		stats.push({
			deviceId: deviceId,
			consumed: consumedPerCycle[i],
			time: dates[i],
			type: type
		});
	});
	return stats;
}

var getAnimalCloseNotifications = function(cycles, period, lowerDate, deviceId) {
	var dates = getDatesByPeriod(lowerDate, period, cycles);
	return getNotifications(dates, deviceId, env.messages.animalIsClose);
}

var options = {
	pets: {
		feedingPeriod: 6,
		feedingOffset: 30,
		feedingAmount: 50,
		feedingAmountOffset: 30,
		waterPeriod: 8,
		waterOffset: 25,
		waterAmount: 20,
		waterAmountOffset: 10
	},
	fishes: {
		feedingPeriod: 22,
		feedingOffset: 10,
		feedingAmount: 30,
		feedingAmountOffset: 25
	}
};

var activities = {

	pets : function(model, timeRange) {
		var notifications = [];
		var stats = [];

		var feedingPeriod = (24 / 
			random.blurValue(options.pets.feedingPeriod, options.pets.feedingOffset))
			* 60 * 60; // seconds
		var feedingCycles = cyclesNumber(timeRange, feedingPeriod);
		var emulated = cycle(
			model.config.foodModule.currentFoodAmount,
		  env.deviceBase.MAX_FOOD_AMOUNT,
			options.pets.feedingAmount,
			options.pets.feedingOffset,
			model.config.foodModule.foodAmountThreshold,
			feedingCycles
		);
		var feedingNotifications = getNotifications(
			getNotificationDates(timeRange.lowerDate, emulated.activeCycles, feedingPeriod),
			model._id,
			env.messages.foodShortage
		);
		var petIsEatingNotifications = getAnimalCloseNotifications(
			feedingCycles, feedingPeriod, timeRange.lowerDate, model._id
		);
		notifications = notifications.concat(petIsEatingNotifications);
		notifications = notifications.concat(feedingNotifications);
		stats = stats.concat(
			getConsumptionStats(
				emulated.consumedPerCycle,
				getDatesByPeriod(timeRange.lowerDate, feedingPeriod, feedingCycles),
				model._id,
				'food'
		));
		model.config.foodModule.currentFoodAmount = emulated.resultValue;

		var drinkingPeriod = (24 / 
			random.blurValue(options.pets.waterPeriod, options.pets.waterOffset))
			* 60 * 60; // seconds
		var drinkingCycles = cyclesNumber(timeRange, drinkingPeriod);
		emulated = cycle(
			model.config.waterModule.currentWaterAmount,
			env.deviceBase.MAX_WATER_AMOUNT,
			options.pets.waterAmount,
			options.pets.waterAmountOffset,
			model.config.waterModule.waterAmountThreshold,
			drinkingCycles
		);
		var drinkingNotifications = getNotifications(
			getNotificationDates(timeRange.lowerDate, emulated.activeCycles, drinkingPeriod),
			model._id,
			env.messages.waterShortage
		);
		var petIsDrinkingNotifications = getAnimalCloseNotifications(
			drinkingCycles, drinkingPeriod, timeRange.lowerDate, model._id
		);
		notifications = notifications.concat(petIsDrinkingNotifications);
		notifications = notifications.concat(drinkingNotifications);
		stats = stats.concat(
			getConsumptionStats(
				emulated.consumedPerCycle,
				getDatesByPeriod(timeRange.lowerDate, drinkingPeriod, drinkingCycles),
				model._id,
				'water'
		));

		model.config.waterModule.currentWaterAmount = emulated.resultValue;
		console.log(
				'generated ' + 
				notifications.length +
			 	' notifications, ' +
			  stats.length +
			  ' stats.'
			);
		return { notifications: notifications, stats: stats };
	},
	plants: function(model, timeRange) {
		var notifications = [];

		var period = model.config.irrigationModule.irrigationFrequency * 60 * 60; // sec
		var cycles = cyclesNumber(timeRange, period);
		var emulated = cycle(
			model.config.irrigationModule.currentWaterAmount,
			env.deviceBase.MAX_WATER_AMOUNT,
			model.config.irrigationModule.waterPortion,
			0,
			model.config.irrigationModule.waterAmountThreshold,
			cycles
		);
		var irrigationNotifications = getNotifications(
			getNotificationDates(timeRange.lowerDate, emulated.activeCycles, period),
			model._id,
			env.messages.waterShortage
		);
		notifications = notifications.concat(irrigationNotifications);
		model.config.irrigationModule.currentWaterAmount = emulated.resultValue;

		period = model.config.sprayingModule.sprayFrequency * 60 * 60; //sec
		cycles = cyclesNumber(timeRange, period);
		emulated = cycle(
			model.config.sprayingModule.currentSprayingMaterialAmount,
			env.deviceBase.MAX_SPRAYER_AMOUNT,
			model.config.sprayingModule.sprayAmount,
			0,
			model.config.sprayingModule.sprayingMaterialAmountThreshold,
			cycles
		);
		var sprayingNotifications = getNotifications(
			getNotificationDates(timeRange.lowerDate, emulated.activeCycles, period),
			model._id,
			env.messages.sprayingMaterialShortage
		);
		notifications = notifications.concat(sprayingNotifications);
		model.config.irrigationModule.currentSprayingMaterialAmount = emulated.resultValue;
		console.log('generated ' + notifications.length + ' notifications');
		return { notifications: notifications, stats: [] };
	},
	fishes: function(model, timeRange) {
		
		var notifications = [];

		var period = (24 / 
			random.blurValue(options.fishes.feedingPeriod, options.fishes.feedingOffset))
			* 60 * 60; // seconds
		var cycles = cyclesNumber(timeRange, period);
		var dates = getDatesByPeriod(timeRange.lowerDate, period, cycles);
		var emulated = cycle(
			model.config.foodModule.currentFoodAmount,
			env.deviceBase.MAX_FOOD_AMOUNT,
			model.config.foodModule.foodDailyRation,
			0,
			model.config.foodModule.foodAmountThreshold,
			cycles
		);
		var feedingNotifications = getNotifications(
			getNotificationDates(timeRange.lowerDate, emulated.activeCycles, period),
			model._id,
			env.messages.foodShortage
		);
		notifications = notifications.concat(feedingNotifications);

		model.config.foodModule.currentFoodAmount = emulated.resultValue;
		console.log('generated ' + notifications.length + ' notifications');
		return { notifications: notifications, stats: [] };
	}
}

exports.generate = function(deviceModel, timeRange) {
	return activities[deviceModel.type](deviceModel, timeRange);
};