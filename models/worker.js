var mongoose  = require('mongoose'),
    jwt       = require('jsonwebtoken'),
    Schema    = mongoose.Schema;

var WorkerSchema = new Schema({
  rut: {type: String, default: null, trim: true, unique: true},
  email: {type: String, default: null, trim: true},
  first_name: {type: String, default: null, trim: true},
  last_name1: {type: String, default: null, trim: true},
  last_name2: {type: String, default: null, trim: true},
  country: {type: String, default: 'N/A'},
  birth_date: {type: String, default: null},
  phone_number: {type: String, default: null},
  address: {type: String, default: null},
  health_plan: {type: String, default: null},
  contributions: {type: String, default: null},
  clothing_sizes: {
    jacket: {type: String, default: null},
    pants: {type: String, default: null},
    shoes: {type: String, default: null},
  },
  job: {
    area: {type: String, default: null},
    place: {type: String, default: null},
    position: {type: String, default: null},
    contract: {type: String, default: null}
  },
  emergency_contact: {
    name: {type: String, default: null},
    phone_number: {type: String, default: null}
  },
  payment: {
    bank: {type: String, default: null},
    account_number: {type: String, default: null},
    account_type: {type: String, default: null}
  },
  join_date: {type: Date, default: null},
  feeding_schema: {type: String, default: null},
  housing: {type: String, default: null, ref: 'Housing'},
  issues: [{type: String, default: null, ref: 'Issue'}],
  feeding: {type: String, deault: null, ref: 'Feeding'},
  status: {type: Boolean, default: true}
});

//Export WorkerSchema
module.exports = mongoose.model('Worker', WorkerSchema);
