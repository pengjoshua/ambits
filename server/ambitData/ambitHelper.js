var Ambit = require('./ambitSchema.js');
var q = require('q');

var findAmbit = q.nbind(Ambit.findOne, Ambit);
var findAllAmbits = q.nbind(Ambit.find, Ambit);
var createAmbit = q.nbind(Ambit.create, Ambit);

module.exports.addAmbit = function (req, res, next) {
  //records a new ambit from the user
  var ambit = req.body.ambit;
  ambit.checkIns = [];
  ambit.refId = Math.round(Math.random()*10000);

  findAmbit({refId: ambit.refId}) //should check per user as well
    .then(function(found){
      if (found) {
        return next(new Error('Ambit refId already exists'));
      } else{
        return createAmbit(ambit);
      }
    })
    .then(function (createdAmbit) {
      if (createdAmbit) {
        res.json(createdAmbit);
      }
    })
    .fail(function (error) {
      next(error);
    });
};

module.exports.saveCheckIn = function(req, res, next) {
  //add the current date to the ambits checkIn property
  //TODO: check for a preexisting check-in for this date first

  var refId = req.params.id;

  findAmbit({refId: refId})
    .then(function(ambit) {
      var now = new Date;
      var today = now.toDateString();
      var lastCheck = ambit.checkIns.length ? ambit.checkIns[ambit.checkIns.length -1].toDateString() : null;
      if (today !== lastCheck){
        ambit.checkIns.push( now );
        return ambit.save();
      } else {
        res.json('already checked in');
      }
    })
    .then(function(savedAmbit) {
      res.send(savedAmbit);
    });
};

module.exports.getAmbits = function(req, res, next) {
  //send an array containing all the ambits back to the user.

  findAllAmbits()
    .then(function(ambits){
      res.send(ambits);
    })
    .fail(function (error) {
      next(error);
    });
};
