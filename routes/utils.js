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

router.get('/access', Auth.isAuthorized, function(req, res) {
  var user_id = req.currentUser._id;

  User.findOne({_id: user_id}).exec(function(err, user) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Internal Error'});
    }
    //If no error
    else {
      //Send the user object back
      if (user){
        //Remove password from sendable object
        user.password = null;
        res.status(200).json(user.access);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'User not found'});
      }
    }
  });
});

module.exports = router;
