var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  name: String,
  userId: {
  	type: String,
  	ref: 'User'
  },
  type: String,
  config: Schema.Types.Mixed
});

module.exports = mongoose.model('Device', DeviceSchema);