var express = require('express');
    config  = require('../config');
    Auth    = require('../lib/auth');
    Item    = require('../models/item');
    router  = express.Router();

router.get('/items/:item_id', Auth.isAuthorized, function(req, res) {
  var item_id = req.params.item_id;

  Item.findOne({_id: item_id}).exec(function(err, item) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (item){
        res.status(200).json(item);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'Insumo no encontrado'});
      }
    }
  });
});

router.get('/items', Auth.isAuthorized, function(req, res) {

  Item.find({}).exec(function(err, items) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (items){
        res.status(200).json(items);
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'No se han encontrado datos'});
      }
    }
  });
});


router.post('/items', Auth.isAuthorized, function(req, res) {
  if (req.body.new_item) {
    item = new Item(req.body.new_item)

    item.save(function (err) {
      if (err) res.status(400).json({message: 'Ha ocurrido un error al crear el insumo (Ya existe el identificador)'});

      else res.status(201).json({message: 'El insumo se ha creado exitosamente'})
    })

  } else {
    res.status(500).json({message: 'Error Interno'})
  }
});

router.patch('/items/:item_id', Auth.isAuthorized, function(req, res) {
  var item_id = req.params.item_id;

  Item.findOneAndUpdate({_id: item_id}, req.body.item).exec(function(err, place) {
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

router.delete('/items/:item_id', Auth.isAuthorized, function(req, res) {
  var item_id = req.params.item_id;

  Item.findOne({_id: item_id}).exec(function(err, item) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (item){
        if (item.issue != null) {
          res.status(400).json({message: 'No puedes eliminar un insumo en prestamo!'});
        } else {
          item.remove();
          res.status(200).json({message: 'El insumo ha sido eliminado!'});
        }
      }
      //If no user was found send a 404 error back.
      else {
        res.status(404).json({message: 'El insumo no existe'});
      }
    }
  });
});


router.get('/items/search/:item_inner_id', function(req, res) {

  var item_inner_id = req.params.item_inner_id;

  Item.find({inner_id: { "$regex": item_inner_id, "$options": "i" }}).exec(function(err, items) {
    //Error Handling
    if (err) {
      res.status(500).json({message: 'Error Interno'});
    }
    //If no error
    else {
      //Send the user object back
      if (items){
        var result = []

        for (var i = 0 ; i < items.length ; i++) {
          result[i] = {
            _id: items[i]._id,
            issue: items[i].issue,
            info: '(' + items[i].inner_id + ') ' + items[i].name
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

module.exports = router;
