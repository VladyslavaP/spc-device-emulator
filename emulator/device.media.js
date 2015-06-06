var random = require('../utils/random.util.js');
var env = require('../env.js');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-config.json');
var bucket = new AWS.S3({ params: { Bucket: 'spc-media'}});
var env = require('../env.js');

module.exports = function(model) {

	this.getRandomPhoto = function(callback) {
		bucket.listObjects(
			{ Bucket: 'spc-media'},
			function(err, data) {
				if (err) { callback() };
				var randomIndex = random.randomInRange(0, data.Contents.length);
				var url = env.s3.bucketUrl + data.Contents[randomIndex].Key;
				callback(url);
  			}
  		);
	};
}