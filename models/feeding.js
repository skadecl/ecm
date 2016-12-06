var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var FeedingSchema = new Schema({
  name: {type: String, default: null, trim: true},
  description: {type: String, default: null},
  plan: {
    breakfast: {type: Boolean, default: false},
    snack: {type: Boolean, default: false},
    lunch: {type: Boolean, default: false},
    dinner: {type: Boolean, default: false}
  }
});

//Export WorkerSchema
module.exports = mongoose.model('Feeding', FeedingSchema);
