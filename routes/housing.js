var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    Housing    = require('../models/housing');
    Worker  = require('../models/worker');
    router  = express.Router();

router.get('/housing/:housing_id', Auth.isAuthorized, function(req, res) {
  var housing_id = req.params.housing_id;

  var populate_options = {
    path: 'people',
    select: 'first_name last_name1 last_name2 country job'
  }

  Housing.findOne({_id: housing_id}).populate(populate_options).exec(function(err, housing) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (housing){
        res.status(200).json(housing);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Residencia no encontrada'});
      }
    }
  });
});

router.get('/housing', Auth.isAuthorized, function(req, res) {

  Housing.find({}).exec(function(err, housings) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (housings){
        res.status(200).json(housings);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
      }
    }
  });
});


router.post('/housing', Auth.isAuthorized, function(req, res) {

  if (req.body.new_housing) {
    housing = new Housing(req.body.new_housing)

    housing.save(function (err) {
      if (err) res.status(400).json({message: 'Ha ocurrido un error al crear la residencia! (Ya existe?)'});

      else res.status(201).json({message: 'La residencia se ha creado exitosamente'})
    })

  } else {
    res.status(500).json({message: 'Error Interno'})
  }
});

router.patch('/housing/:housing_id', Auth.isAuthorized, function(req, res) {
  var housing_id = req.params.housing_id;

  Housing.findOneAndUpdate({_id: housing_id}, req.body.housing).exec(function(err, place) {
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

router.delete('/housing/:housing_id', Auth.isAuthorized, function(req, res) {
  var housing_id = req.params.housing_id;

  Housing.findOne({_id: housing_id}).exec(function(err, housing) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (housing){
        if (housing.people.length > 0) {
          res.status(400).json({message: 'La residencia debe estar vacía para eliminarla!'});
        }else {
          housing.remove();
          res.status(200).json({message: 'La residencia ha sido eliminada!'});
        }
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'La residencia no existe'});
      }
    }
  });
});

router.get('/housing/:housing_id/add/:worker_id', Auth.isAuthorized, function(req, res) {
  var housing_id = req.params.housing_id;
  var worker_id = req.params.worker_id;

  Housing.findOne({_id: housing_id}).exec(function(err, housing) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (housing){
        if (housing.people.length >= housing.capacity) {
          res.status(400).json({message: 'La residencia esta llena'})
        }
        else {
          Worker.findOne({_id: worker_id}).exec(function(err, worker){
            if (err) {
              res.status(500).json({message: 'Error Interno'})
            }
            else {
              if (worker) {
                if (worker.housing != null) {
                  res.status(400).json({message: 'El trabajador ya tiene una residencia'})
                }
                else {
                  worker.housing = housing_id
                  worker.save()

                  housing.people.push(worker_id)
                  housing.save()
                  res.status(200).json({message: 'El trabajador se ha agregado a la residencia!', worker: worker})
                }
              } else {
                res.status(400).json({message: 'Trabajador no existe'})
              }
            }
          })
        }
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Residencia no encontrada'});
      }
    }
  });
});

router.get('/housing/:housing_id/remove/:worker_id', Auth.isAuthorized, function(req, res) {
  var housing_id = req.params.housing_id;
  var worker_id = req.params.worker_id;

  Housing.findOne({_id: housing_id}).exec(function(err, housing) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (housing){
        Worker.findOne({_id: worker_id}).exec(function(err, worker){
          if (err) {
            res.status(500).json({message: 'Error Interno'})
          }
          else {
            if (worker) {
              worker.housing = null
              worker.save()

              var index = housing.people.indexOf(worker._id)
              housing.people.splice(index, 1)
              housing.save()
              res.status(200).json({message: 'El trabajador ha sido eliminado de la residencia'})
            } else {
              res.status(400).json({message: 'Trabajador no existe'})
            }
          }
        })
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Residencia no encontrada'});
      }
    }
  });
});

module.exports = router;
