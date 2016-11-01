var jwt     = require('jsonwebtoken'),
    config  = require('../config.js'),
    User    = require('../models/user');

module.exports = {
  'isAuthorized': function (req, res, next) {

    var internalErrorResponse = {
      message: 'Ha ocurrido un error interno, intentelo nuevamente.'
    };

    var invalidTokenResponse = {
      message: 'La verificación del token a fallado.'
    };

    var noTokenProvidedResponse = {
      message: 'No se ha proporcionado un token.'
    };

    var userNotFoundResponse = {
      message: 'No se ha encontrado el usuario asociado al token.'
    };

    //Take the token from the request body or headers
    var sessionToken = req.body.token || req.query.token || req.headers['token'];

    //Verify the token
    if (sessionToken) {
      jwt.verify(sessionToken, config.sessionSecret, function(err, decoded) {
        //If there's an error send a failure
        if (err) res.status(401).json(invalidTokenResponse);

        //If there's no errors find the user
        else {
          User.findOne({_id: decoded._id}, function (err, user) {
            //Error handling.
            if (err) res.status(500).json(internalErrorResponse);

            //If the user exists, save it and go to the next middleware
            else if (user) {
              req.currentUser = user;
              next();
            }

            //Throw error if there's no user found
            else res.status(404).json(userNotFoundResponse);
          });
        }
      });
    }
    //If there's no token send an error
    else res.status(401).json(noTokenProvidedResponse);
  },

  'isAdmin': function (req, res, next) {
    if (req.currentUser.admin) {
      next();
    } else {
      res.status(401).json({
        message: 'No tienes permiso para estar aquí.'
      });
    }
  }
}
