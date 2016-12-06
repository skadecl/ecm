var mongoose  = require('mongoose'),
    jwt       = require('jsonwebtoken'),
    Schema    = mongoose.Schema;

var HousingSchema = new Schema({
  name: {type: String, default: null, trim: true},
  address: {type: String, default: null, trim: true},
  rooms: {type: Number, default: 0},
  beds: {type: Number, default: 0},
  capacity: {type: Number, default: 0},
  genre: {type: String, default: null, trim: true},
  people: [{type: String, ref: 'Worker'}]
});

//Export WorkerSchema
module.exports = mongoose.model('Housing', HousingSchema);
