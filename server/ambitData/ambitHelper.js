var Ambit = require('./ambitSchema.js');
var q = require('q');
var jwt = require('jwt-simple');

var findAmbit = q.nbind(Ambit.findOne, Ambit);
var findAllAmbits = q.nbind(Ambit.find, Ambit);
var createAmbit = q.nbind(Ambit.create, Ambit);

module.exports.addAmbit = function (req, res, next) {
  //records a new ambit from the user
  var ambit = req.body.ambit;
  var token = req.headers.token;
  var user = jwt.decode(token, process.env.JWT_SECRET || 'ancient dev secret');
  ambit.userId = user._id;
  ambit.checkIns = [];
  // TODO: create unique refId
  ambit.refId = Math.round(Math.random()*10000);

  findAmbit({
    refId: ambit.refId,
    userId: ambit.userId
  })
    .then(function(found){
      if (found) {
        return next(new Error('Ambit refId already exists'));
      } else{
        console.log(ambit)
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
  var token = req.headers.token;
  var user = jwt.decode(token, process.env.JWT_SECRET || 'ancient dev secret');
  findAmbit({
    refId: refId,
    userId: user._id
  })
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
  var token = req.headers.token;
  var user = jwt.decode(token, process.env.JWT_SECRET || 'ancient dev secret');
  findAllAmbits({ userId: user._id })
    .then(function(ambits){
      res.send(ambits);
    })
    .fail(function (error) {
      next(error);
    });
};
