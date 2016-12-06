var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    Feeding  = require('../models/feeding');
    router  = express.Router();

router.get('/feeding/:feeding_id', Auth.isAuthorized, function(req, res) {
  var feeding_id = req.params.feeding_id;

  Feeding.findOne({_id: feeding_id}).exec(function(err, feeding) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (feeding){
        res.status(200).json(feeding);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Plan de alimentación no encontrado'});
      }
    }
  });
});

router.get('/feeding', Auth.isAuthorized, function(req, res) {

  Feeding.find({}).exec(function(err, feeding) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (feeding){
        res.status(200).json(feeding);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
      }
    }
  });
});


router.post('/feeding', Auth.isAuthorized, function(req, res) {

  if (req.body.new_feeding) {
    feeding = new Feeding(req.body.new_feeding)

    feeding.save(function (err) {
      if (err) res.status(400).json({message: 'Ha ocurrido un error al el plan de alimentación'});

      else res.status(201).json({message: 'El plan de alimentación se ha creado exitosamente'})
    })

  } else {
    res.status(500).json({message: 'Error Interno'})
  }
});


router.patch('/feeding/:feeding_id', Auth.isAuthorized, function(req, res) {
  var feeding_id = req.params.feeding_id;

  Feeding.findOneAndUpdate({_id: feeding_id}, req.body.feeding).exec(function(err, place) {
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

router.delete('/feeding/:feeding_id', Auth.isAuthorized, function(req, res) {
  var feeding_id = req.params.feeding_id;


  Feeding.findOne({_id: feeding_id}).exec(function(err, feeding) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (feeding){
        feeding.remove()
        res.status(200).json({message: 'Plan de Alimentación eliminado!'});
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'El plan de alimentación no existe'});
      }
    }
  });
});

module.exports = router;
