module.exports = {
	PORT: 9001,
	deviceBase: {
		MAX_WATER_AMOUNT: 1000,
		WATER_CONSUMPTION: 100,
		MAX_FOOD_AMOUNT: 1000,
		MAX_SPRAYER_AMOUNT: 100,
	},
	api: {
		getDevicesUrl: 'http://127.0.0.1:9000/api/devices',
		postNotificationUrl: 'http://127.0.0.1:9000/api/notifications/',
		updateDeviceUrl: 'http://127.0.0.1:9000/api/devices/updateFromString/'
	},
	s3: {
		bucketUrl: 'https://spc-media.s3.eu-central-1.amazonaws.com/'
	},
	messages: {
		waterShortage: 'Please refill water container.',
		foodShortage: 'Please refill food container.',
		sprayingMaterialShortage: 'Please refill spraying material container.'
	}
}