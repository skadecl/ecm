var express = require('express'),
    config  = require('../config'),
    Auth    = require('../lib/auth'),
    Worker    = require('../models/worker'),
    fs      = require('fs'),
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

// router.get('/genfakedata', function(req, res) {
//
//   var fake_data = JSON.parse(fs.readFileSync('fake-data.json', 'utf8'));
//
//   for (var i = 0 ; i < fake_data.length ; i++) {
//     var worker = new Worker(fake_data[i]);
//     worker.save();
//   }
//
//   res.status(200).end();
//
// });

module.exports = router;
