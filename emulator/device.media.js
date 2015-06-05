var random = require('../utils/random.util.js');

module.exports = function(model) {
	this.directoryPath = '/photos/' + this.model._id.toString();
	this.photos = [];

	this.init = function() {
		this.setupDirectory();
		this.scanDirectory();
	};

	this.setupDirectory = function() {
		if (!fs.existsSync(this.directoryPath)) {
			fs.mkdir(this.directoryPath);
		}
	};

	this.scanDirectory = function() {
		fs.readdir(this.directoryPath, function(err, files) {
			this.photos = files;
		});
	};

	this.getRandomPhoto = function() {
		if (this.photos.length === 0) {
			return undefined;
		}
		var randomIndex = random.randomInRange(0, this.photos.length);
		return this.photos[randomIndex];
	};
}