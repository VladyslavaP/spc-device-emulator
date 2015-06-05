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
}