var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    FeedingDay  = require('../models/feeding_day');
    router  = express.Router();


var getTodaysDate = function() {
      var date =  new Date()
      var year = date.getFullYear();
      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return day + '/' + month + '/' + year;
    }

var getddMMyyyy = function (timestamp) {
  var date =  new Date(timestamp)
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return day + '/' + month + '/' + year;
}

    var empty_assignment = {
      breakfast: false,
      snack: false,
      lunch: false,
      dinner: false
    }


router.get('/feeding_days/:feeding_day_timestamp', Auth.isAuthorized, function(req, res) {
  var feeding_day_date = getddMMyyyy(parseInt(req.params.feeding_day_timestamp));

  var populate_options = {
    path: 'assignments.worker',
    select: 'first_name last_name1 last_name2 feeding',
    populate: {
      path: 'feeding',
      select: 'plan'
    }
  }

  FeedingDay.findOne({day_date: feeding_day_date}).populate(populate_options).exec(function(err, feeding_day) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (feeding_day){
        res.status(200).json(feeding_day);
      }
      //If no user was found send a 404 error back.
      else {
        var todays_date = getTodaysDate()

        var new_feeding_day = new FeedingDay({
          day_date: todays_date
        })

        new_feeding_day.save(function(err) {
          if (err) {
            res.status(500).json({message: 'Error Interno'});
          }
          else {
            res.status(200).json(new_feeding_day);
          }
        })
      }
    }
  });
});

router.get('/feeding_days/today/status/:worker_id', Auth.isAuthorized, function(req, res) {
  var feeding_day_id = req.params.feeding_day_id;
  var worker_id = req.params.worker_id
  var todays_date = getTodaysDate()

  FeedingDay.findOne({day_date: todays_date}).exec(function(err, feeding_day) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (feeding_day){
        if (feeding_day.assignments.length > 0) {
          for (var i = 0 ; i < feeding_day.assignments.length ; i++) {
            if (feeding_day.assignments[i].worker == worker_id) {
              res.status(200).json(feeding_day.assignments[i].given)
              break
            }

            if (i == feeding_day.assignments.length - 1) {
              res.status(200).json(empty_assignment)
            }
          }
        }
        else {
          res.status(200).json(empty_assignment)
        }
      }
      //If no user was found send a 404 error back.
      else {
        var todays_date = getTodaysDate()

        var new_feeding_day = new FeedingDay({
          day_date: todays_date
        })

        new_feeding_day.save(function(err) {
          if (err) {
            res.status(500).json({message: 'Error Interno'});
          }
          else {
            res.status(200).json(empty_assignment);
          }
        })
      }
    }
  });
});


router.get('/feeding_days/today/assign/:worker_id/:meal_name', Auth.isAuthorized, function(req, res) {
  var feeding_day_id = req.params.feeding_day_id;
  var worker_id = req.params.worker_id
  var meal_name = req.params.meal_name

  var todays_date = getTodaysDate()

  FeedingDay.findOne({day_date: todays_date}).exec(function(err, feeding_day) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (feeding_day){
        if (feeding_day.assignments.length > 0) {
          for (var i = 0 ; i < feeding_day.assignments.length ; i++) {
            if (feeding_day.assignments[i].worker == worker_id) {
              if (feeding_day.assignments[i].given[meal_name]) {
                res.status(400).json({message: 'La comida ya fue entregada anteriormente'})
                break
              }
              else {
                feeding_day.assignments[i].given[meal_name] = true
                feeding_day.save()
                res.status(200).json({message: 'Comida Entregada'})
                break
              }
            }

            if (i == feeding_day.assignments.length - 1) {
              var new_assignment = empty_assignment
              new_assignment[meal_name] = true;

              feeding_day.assignments.push({worker: worker_id, given: new_assignment});
              feeding_day.save()
              res.status(200).json({message: 'Comida Entregada'})
              break
            }
          }
        }
        else {
          var new_assignment = empty_assignment
          new_assignment[meal_name] = true;

          feeding_day.assignments.push({worker: worker_id, given: new_assignment});
          feeding_day.save()
          res.status(200).json({message: 'Comida Entregada'})
        }
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Dia de alimentación no encontrado'});
      }
    }
  });
});


router.delete('/feeding_days/:feeding_day_id', Auth.isAuthorized, function(req, res) {
  var feeding_day_id = req.params.feeding_day_id;


  FeedingDay.findOne({_id: feeding_day_id}).exec(function(err, feeding_day) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (feeding_day){
        feeding_day.remove()
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
