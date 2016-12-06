var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var IssueSchema = new Schema({
  item: {type: String, ref: 'Item'},
  worker: {type: String, ref: 'Worker'}
});

//Export WorkerSchema
module.exports = mongoose.model('Issue', IssueSchema);
