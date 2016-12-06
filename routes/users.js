var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    User    = require('../models/user');
    router  = express.Router();

//***
//* [GET] /api/user/get/:user_id
//* Returns an user identified by $user_id
//***

router.get('/users/:user_id', Auth.isAuthorized, function(req, res) {
  var user_id = req.params.user_id;

  User.findOne({_id: user_id}).exec(function(err, user) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (user){
        user.password = null
        res.status(200).json(user);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Usuario no encontrado'});
      }
    }
  });
});


router.get('/users', Auth.isAuthorized, function(req, res) {

  User.find({}).exec(function(err, users) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (users){
        res.status(200).json(users);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
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

router.post('/users', Auth.isAuthorized, function(req, res) {
  var user_id = req.currentUser._id;

  if (req.body.new_user) {
    user = new User(req.body.new_user)

    user.save(function (err) {
      if (err) res.status(400).json({message: 'Ha ocurrido un error al crear el usuario! (Ya existe?)'});

      else res.status(201).json({message: 'El usuario se ha creado exitosamente'})
    })

  } else {
    res.status(500).json({message: 'Error Interno'})
  }
});


router.patch('/users/:user_id', Auth.isAuthorized, function(req, res) {
  var user_id = req.params.user_id;
  var updated_user = req.body.user;
  delete updated_user.password

  User.findOneAndUpdate({_id: user_id}, updated_user).exec(function(err, place) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (place){
        res.status(200).json({message: 'Los cambios han sido guardados'});
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
      }
    }
  });
});


module.exports = router;
