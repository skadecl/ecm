var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    Transport  = require('../models/transport');
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


router.get('/transport/:transport_timestamp', Auth.isAuthorized, function(req, res) {
  var transport_date = getddMMyyyy(parseInt(req.params.transport_timestamp));

  var populate_options = {
    path: 'passengers.worker',
    select: 'first_name last_name1 last_name2'
  }

  Transport.findOne({day_date: transport_date}).populate(populate_options).exec(function(err, transport) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (transport){
        res.status(200).json(transport);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se encontraron datos de transporte para ese día'})
      }
    }
  });
});


router.post('/transport/:transport_timestamp', Auth.isAuthorized, function(req, res) {
  var transport_date = getddMMyyyy(parseInt(req.params.transport_timestamp));

  var new_passenger = req.body.new_passenger

  if (req.body.new_passenger) {
    Transport.findOne({day_date: transport_date}).exec(function(err, transport) {
      //Error Handling
      if (err) {
        res.status(500).json({message: 'Error Interno'});
      }
      //If no error
      else {
        //Send the user object back
        if (transport){
          if (transport.passengers.length > 0) {
            for (var i = 0 ; i < transport.passengers.length ; i++) {
              if (transport.passengers[i].worker == new_passenger.worker) {
                res.status(400).json({message: 'El pasajero ya se encuentra en la lista!'})
                break
              }

              if (i == transport.passengers.length - 1) {
                transport.passengers.push(new_passenger)
                transport.save()
                res.status(200).json({message: 'Pasajero Agregado'})
                break
              }
            }
          }
          else {
            transport.passengers.push(new_passenger)
            transport.save()
            res.status(200).json({message: 'Pasajero Agregado'})
          }
        }
        //If no user was found send a 404 error back.
        else {
          var new_transport = new Transport({day_date: transport_date})
          new_transport.passengers.push(new_passenger);
          new_transport.save(function(err){
            if (err) res.status(500).json({message: 'Error Interno'})

            else {
              res.status(200).json({message: 'Pasajero Agregado'})
            }
          })
        }
      }
    });
  }
  else {
    res.status(400).json({message: 'Datos erroneos'})
  }
});


module.exports = router;
