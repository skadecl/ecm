var mongoose  = require('mongoose'),
    jwt       = require('jsonwebtoken'),
    bcrypt    = require('bcrypt'),
    config    = require('../config'),
    Schema    = mongoose.Schema;

var UserSchema = new Schema({
  rut: {type: String, trim: true, unique: true, required: true, index: true},
  email: {type: String, trim: true, unique: true, required: true, index: true},
  password: {type: String, required: true},
  first_name: {type: String, default: null, trim: true},
  last_name: {type: String, default: null, trim: true},
  admin: {type: Boolean, default: false}
});

//UserSchema callbacks
UserSchema.pre('save', function(next) {
  var user = this;

  //Has the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  //Generate a salt
  bcrypt.genSalt(config.saltRounds, function(err, salt) {
    if (err) return next(err);

    //Hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      //Override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

//UserSchema methods
UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, success) {

    //Error handling
    if (err) callback(err);
    else callback(null, success);
  });
};

UserSchema.methods.generateToken =  function() {
  return jwt.sign({
    _id: this._id,
    admin: this.admin
  },
  config.sessionSecret,
  {
    expiresIn: config.sessionTime
  });
};

//Export UserSchema
module.exports = mongoose.model('User', UserSchema);
