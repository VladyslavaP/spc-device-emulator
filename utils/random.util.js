exports.randomInRange = function(a, b) {
	if ((a - b) > 0) { 
		return 0; 
	}
	var magnitude = b - a;
	var randomMultiplier = Math.random();

	return Math.floor(randomMultiplier * magnitude) + a;
};

exports.randomTimeInRange = function(a, b) {
	var difference = b - a;
	var randomMultiplier = Math.random();

	var time = new Date(a);
	time.setSeconds(time.getSeconds() + Math.floor(difference * randomMultiplier));

	return time;
};

exports.coinflip = function() {
	return Math.random() < 0.5;
};

exports.blurWholeValue = function(number, possibleOffset) {
	var maxBlurValue = Math.floor(number * (possibleOffset / 100));
	var randomizedOffset = Math.ceil(Math.random() * maxBlurValue);
	var randomSign = this.coinflip() ? 1 : -1;
	var blurValue = randomizedOffset * randomSign;
	return number + blurValue;
};

exports.blurValue = function(number, possibleOffset) {
	var randomizedOffset = Math.random() * possibleOffset;
	var randomSign = this.coinflip() ? 1 : -1;
	var blurValue = (randomizedOffset / 100.0) * number * randomSign;
	return parseFloat((number + blurValue).toFixed(2));
};