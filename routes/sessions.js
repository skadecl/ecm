var express = require('express'),
    jwt     = require('jsonwebtoken'),
    config  = require('../config'),
    User    = require('../models/user'),
    router  = express.Router();

//***
//* [POST] /api/auth
//* Logs in a user (JWT)
//***

router.post('/sign_in', function(req, res) {

  var internalErrorResponse = {
    message: 'Ha ocurrido un error interno, intentelo nuevamente.'
  };

  var invalidCredentialsResponse = {
    message: 'RUT y/o contraseña inválidos, intentelo nuevamente.'
  };

  //Find the user in the DB
  User.findOne({rut: req.body.rut}, function (err, user) {
    //Error handling.
    if (err) res.status(500).json(internalErrorResponse);

    //If the user exists verify their credentials
    else if (user) user.verifyPassword(req.body.password, function(error, success) {
      //Error handling
      if (error) res.status(500).json(internalErrorResponse);

      //If passwords match generate a new TOKEN and send it
      else if (success) res.json({
        sessionToken: user.generateToken(),
        userData: {
          _id: user._id,
          name: user.name
        }
      });

      //If they don't
      else res.status(401).json(invalidCredentialsResponse);
    });

    //Throw error if there's no user found
    else res.status(401).json(invalidCredentialsResponse);
  });
});

module.exports = router;
