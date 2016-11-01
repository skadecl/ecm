var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    User    = require('../models/user');
    router  = express.Router();

//***
//* [GET] /api/user/get/:user_id
//* Returns an user identified by $user_id
//***

router.get('/user/get/:user_id', Auth.isAuthorized, function(req, res) {
  var user_id = req.params.user_id;

  //Populate teams with name and captain
  var pop_options = {
    path: 'teams',
    select: 'name tag captain',
    populate: {
      path: 'captain',
      select: 'name'
    }
  };

  User.findOne({_id: user_id}).populate(pop_options).exec(function(err, user) {
    //Error Handling
    if (err) {
      console.log(err);
      res.status(500).json({message: 'Internal Error'});
    }
    //If no error
    else {
      //Send the user object back
      if (user){
        //Remove password from sendable object
        user.password = null;
        res.status(200).json(user);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'User not found'});
      }
    }
  });
});

//***
//* [POST] /api/user/update
//* Updates an user
//***

router.post('/user/update', Auth.isAuthorized, function(req, res) {
  var update_params = ['name', 'email'];
  var changes = req.body.changes;

  if (changes) {
    for (var attr in changes) {
      if (update_params.indexOf(attr) >= 0) {
        req.currentUser[attr] = changes[attr];
      }
    }

    req.currentUser.save();
    res.status(200).json({message: 'User updated'});
  }
});

module.exports = router;
