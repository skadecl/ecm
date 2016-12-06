var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var TransportSchema = new Schema({
  day_date: {type: String, unique: true},
  passengers: [{
    _id: false,
    worker: {type: String, ref: 'Worker'},
    direction: {type: String, default: null, trim: true},
    origin: {type: String, default: null, trim: true},
    destination: {type: String, default: null, trim: true}
  }]
});

//Export WorkerSchema
module.exports = mongoose.model('Transport', TransportSchema);
