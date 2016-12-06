var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    Worker    = require('../models/worker');
    router  = express.Router();

router.get('/workers/:worker_id', Auth.isAuthorized, function(req, res) {
  var worker_id = req.params.worker_id;

  var populate_options_issues = {
    path: 'issues',
    populate: {
      path: 'item',
      select: 'name size inner_id'
    }
  }

  var populate_options_housing = {
    path: 'housing',
    select: 'name'
  }

  Worker.findOne({_id: worker_id}).populate(populate_options_issues).populate(populate_options_housing).exec(function(err, worker) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (worker){
        res.status(200).json(worker);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Trabajador no encontrado'});
      }
    }
  });
});

router.get('/workers/:worker_id/feeding', Auth.isAuthorized, function(req, res) {
  var worker_id = req.params.worker_id;

  var populate_options = {
    path: 'feeding',
    select: 'plan'
  }

  Worker.findOne({_id: worker_id}, 'feeding').populate(populate_options).exec(function(err, worker) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (worker){
        res.status(200).json(worker);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Trabajador no encontrado'});
      }
    }
  });
});

router.get('/workers', Auth.isAuthorized, function(req, res) {

  Worker.find({}).exec(function(err, workers) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (workers){
        res.status(200).json(workers);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
      }
    }
  });
});


router.post('/workers', Auth.isAuthorized, function(req, res) {
  var user_id = req.currentUser._id;

  if (req.body.new_worker) {
    worker = new Worker(req.body.new_worker)

    worker.save(function (err) {
      if (err) res.status(400).json({message: 'Ha ocurrido un error al crear el trabajador! (Ya existe?)'});

      else res.status(201).json({message: 'El trabajador se ha creado exitosamente'})
    })

  } else {
    res.status(500).json({message: 'Error Interno'})
  }
});

router.patch('/workers/:worker_id', Auth.isAuthorized, function(req, res) {
  var worker_id = req.params.worker_id;

  Worker.findOneAndUpdate({_id: worker_id}, req.body.worker).exec(function(err, place) {
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

router.delete('/workers/:worker_id', Auth.isAuthorized, function(req, res) {
  var worker_id = req.params.worker_id;

  Worker.findOne({_id: worker_id}).exec(function(err, worker) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (worker){
        worker.remove();
        res.status(200).json({message: 'El trabajador ha sido eliminado'});
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'El trabajador no existe'});
      }
    }
  });
});

router.get('/workers/search/:worker_data', function(req, res) {

  var worker_data = req.params.worker_data;

  Worker.find({$or: [{rut: { "$regex": worker_data, "$options": "i" }}, {first_name: { "$regex": worker_data, "$options": "i" }}, {last_name1: { "$regex": worker_data, "$options": "i" }}, {last_name2: { "$regex": worker_data, "$options": "i" }}]}, 'rut first_name last_name1 last_name2').exec(function(err, workers) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (workers){
        var result = []

        for (var i = 0 ; i < workers.length ; i++) {
          result[i] = {
            _id: workers[i]._id,
            info: workers[i].first_name + ' ' + workers[i].last_name1 + ' ' + workers[i].last_name2 + ' (' + workers[i].rut +  ')'
          }
        }

        res.status(200).json(result);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
      }
    }
  });
});


// router.post('/user/update', Auth.isAuthorized, function(req, res) {
//   var update_params = ['name', 'email'];
//   var changes = req.body.changes;
//
//   if (changes) {
//     for (var attr in changes) {
//       if (update_params.indexOf(attr) >= 0) {
//         req.currentUser[attr] = changes[attr];
//       }
//     }
//
//     req.currentUser.save();
//     res.status(200).json({message: 'User updated'});
//   }
// });

module.exports = router;
