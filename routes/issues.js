var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    Issue    = require('../models/issue');
    Item    = require('../models/item');
    Worker  = require('../models/worker');
    router  = express.Router();

router.get('/issues/:issue_id', Auth.isAuthorized, function(req, res) {
  var issue_id = req.params.issue_id;

  var populate_options_worker = {
    path: 'worker',
    select: 'first_name last_name1 last_name2'
  }

  var populate_options_item = {
    path: 'item'
  }

  Issue.findOne({_id: issue_id}).populate(populate_options_item).populate(populate_options_worker).exec(function(err, issue) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (issue){
        res.status(200).json(issue);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Insumo no encontrado'});
      }
    }
  });
});

router.get('/issues', Auth.isAuthorized, function(req, res) {

  var populate_options_worker = {
    path: 'worker',
    select: 'first_name last_name1 last_name2'
  }

  var populate_options_item = {
    path: 'item'
  }


  Issue.find({}).populate(populate_options_item).populate(populate_options_worker).exec(function(err, issues) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (issues){
        res.status(200).json(issues);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
      }
    }
  });
});


router.post('/issues', Auth.isAuthorized, function(req, res) {
  var item_id = req.body.new_issue.item
  var worker_id = req.body.new_issue.worker

  if (req.body.new_issue) {

    Item.findOne({_id: item_id}).exec(function(err, item) {
      //Error Handling
      if (err) {
        res.status(500).json({message: 'Error Interno'});
      }
      //If no error
      else {
        //Send the user object back
        if (item){
          if (item.issue == null) {

            Worker.findOne({_id: worker_id}).exec(function(err, worker) {
              //Error Handling
              if (err) {
                res.status(500).json({message: 'Error Interno'});
              }
              //If no error
              else {
                //Send the user object back
                if (worker){
                  issue = new Issue(req.body.new_issue)

                  issue.save(function (err) {
                    if (err) res.status(400).json({message: 'Ha ocurrido un error al crear el prestamo'});

                    else {
                      worker.issues.push(issue._id)
                      item.issue = issue._id
                      worker.save()
                      item.save()
                      res.status(200).json({message: 'Se ha registrado el prestamo', issue_id: issue._id})
                    }
                  })

                }
                //If no user was found send a 404 error back.
                else {
                  res.status(404).json({message: 'Trabajador no encontrado'});
                }
              }
            });
          }
          else {
            res.status(400).json({message: 'El insumo ya se encuentra en prestamo'});
          }
        }
        //If no user was found send a 404 error back.
        else {
          res.status(404).json({message: 'Trabajador no encontrado'});
        }
      }
    });

  } else {
    res.status(500).json({message: 'Error Interno'})
  }
});

router.patch('/issues/:issue_id', Auth.isAuthorized, function(req, res) {
  var issue_id = req.params.issue_id;

  Issue.findOneAndUpdate({_id: issue_id}, req.body.issue).exec(function(err, place) {
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

router.delete('/issues/:issue_id', Auth.isAuthorized, function(req, res) {
  var issue_id = req.params.issue_id;


  Issue.findOne({_id: issue_id}).exec(function(err, issue) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (issue){
        Worker.findOne({_id: issue.worker}).exec(function(err, worker) {
          //Error Handling
          if (err) {
            res.status(500).json({message: 'Error Interno'});
          }
          //If no error
          else {
            //Send the user object back
            if (worker){
              Item.findOne({_id: issue.item}).exec(function(err, item) {
                //Error Handling
                if (err) {
                  res.status(500).json({message: 'Error Interno'});
                }
                //If no error
                else {
                  //Send the user object back
                  if (item){
                    item.issue = null
                    item.save()

                    var issue_index = worker.issues.indexOf(issue._id)
                    worker.issues.splice(issue_index, 1)
                    worker.save()

                    issue.remove()
                    res.status(200).json({message: 'La devolución se ha registrado!'});
                  }
                  //If no user was found send a 404 error back.
                  else {
                    res.status(404).json({message: 'Insumo no encontrado'});
                  }
                }
              });
            }
            //If no user was found send a 404 error back.
            else {
              res.status(404).json({message: 'Trabajador no encontrado'});
            }
          }
        });
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'El prestamo no existe'});
      }
    }
  });
});

module.exports = router;
