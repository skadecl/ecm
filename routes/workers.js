var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    Worker    = require('../models/worker');
    router  = express.Router();

router.get('/worker/:worker_id', Auth.isAuthorized, function(req, res) {
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


router.post('/worker/new', Auth.isAuthorized, function(req, res) {
  var user_id = req.currentUser._id;

  if (req.body.new_worker) {
    worker = new Worker(req.body.new_worker)

    worker.save(function (err) {
      if (err) res.status(400).json(err);

      else res.status(201).json({message: 'El trabajador se ha creado exitosamente'})
    })

  } else {
    res.status(500).json({message: 'Error Interno'})
  }
});

router.post('/worker/update', Auth.isAuthorized, function(req, res) {
  var worker_id = req.body.worker._id;

  Worker.findOneAndUpdate({_id: worker_id}, req.body.worker).exec(function(err, place) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (place){
        res.status(200).json(place);
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
