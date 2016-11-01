var express = require('express'),
    config  = require('../config'),
    Auth    = require('../lib/auth'),
    User    = require('../models/user'),
    router  = express.Router();


//***
//* [GET] /api/utils/checkemail/:email
//* Checks if $email is being used.
//***
router.get('/checkemail/:email', function(req, res) {
  var email = req.params.email;

  //Try to find an user by his email
  User.findOne({email: email}, function(err, user) {
    //Error handling
    if (err) {
      res.status(500).end();
    } else {
      //If any user is found
      if (user) res.status(200).end();
      //If not
      else res.status(204).end();
    }
  });
});

module.exports = router;
