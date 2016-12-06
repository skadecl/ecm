var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var ItemSchema = new Schema({
  name: {type: String, default: null, trim: true},
  inner_id: {type: String, default: null, trim: true, unique: true},
  type: {type: String, default: null, trim: true},
  size: {type: String, default: null, trim: true},
  comment: {type: String, default: null},
  issue: {type: String, ref: 'Issue'}
});

//Export WorkerSchema
module.exports = mongoose.model('Item', ItemSchema);
