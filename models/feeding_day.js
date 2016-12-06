var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var FeedingDaysSchema = new Schema({
  day_date: {type: String, unique: true},
  assignments: [{
    _id: false,
    worker: {type: String, ref: 'Worker'},
    given: {
      _id: false,
      breakfast: {type: Boolean, default: false},
      snack: {type: Boolean, default: false},
      lunch: {type: Boolean, default: false},
      dinner: {type: Boolean, default: false}
    }
  }]
});

//Export WorkerSchema
module.exports = mongoose.model('FeedingDays', FeedingDaysSchema);
