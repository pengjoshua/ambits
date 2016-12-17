var Ambit = require('./ambitSchema.js');
var q = require('q');
var jwt = require('jwt-simple');

var findAmbit = q.nbind(Ambit.findOne, Ambit);
var findAllAmbits = q.nbind(Ambit.find, Ambit);
var createAmbit = q.nbind(Ambit.create, Ambit);
var deleteAmbit = q.nbind(Ambit.findOneAndRemove, Ambit);
var updateAmbit = q.nbind(Ambit.findOneAndUpdate, Ambit);

updateMissed = function(ambit) {
  var daysSince = function( date1, date2 ) {
    var oneDay=1000*60*60*24;
    var date1ms = date1.getTime();
    var date2ms = date2.getTime();
    var differenceMs = date2ms - date1ms;
    return Math.floor(differenceMs/oneDay); 
  }
  var now = new Date()

  var lastDate = new Date(Math.max(ambit.stats.lastUpdate,
    ambit.checkIns[ambit.checkIns.length - 1] ? ambit.checkIns[ambit.checkIns.length - 1] : ambit.startDate));
  var daysSince = daysSince(lastDate, now);

  if(daysSince < 1) { return; }
  
  var missed = ambit.stats.missed;
  var lastDay = (lastDate.getDay() + 1) % 7;

  for(; lastDay < 7; lastDay++) {
    missed[lastDay] += ambit.weekdays[lastDay] ? 1 : 0;
    daysSince--;
  }

  for(thisWeek = now.getDay() - 1 ; thisWeek >= 0; thisWeek--) {
    missed[thisWeek] += ambit.weekdays[thisWeek] ? 1 : 0;
    daysSince--;
  }

  var weeksMissed = Math.max(daysSince/7, 0);
  for(var i = 0; i < missed.length && weeksMissed; i++) {
    missed[i] += ambit.weekdays[i] ? weeksMissed : 0
  }

  ambit.stats.lastUpdate = now;
}

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
      if (today !== lastCheck && ambit.weekdays[now.getDay()]){
        ambit.checkIns.push(now);
        ambit.stats.made[now.getDay()]++
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

module.exports.deleteAmbit = function(req, res, next) {
  var refId = req.body.ambit.refId;

  // return the deleted ambit
  deleteAmbit({refId: refId})
    .then(function (ambit) {
      console.log('Server: ambit deleted', ambit);
      res.send(ambit);
    })
    .fail(function (error) {
      console.log('Server: failed to delete ambit', error);
      next(error);
    });
}

module.exports.updateAmbit = function(req, res, next) {
  //send an array containing all the ambits back to the user.
  var refId = req.body.ambit.refId;

  var ambit = req.body.ambit;
  updateAmbit({refId: refId}, ambit)
    .then(function(ambit){
      console.log("Server: Ambit updated");
      res.send(ambit);
    })
    .fail(function (error) {
      console.log("Server: Failed to update Ambit");
      next(error);
    });
};

// module.exports.addAmbit = function (req, res, next) {
//   //records a new ambit from the user
//   var ambit = req.body.ambit;
//   var token = req.headers.token;
//   var user = jwt.decode(token, process.env.JWT_SECRET || 'ancient dev secret');
//   ambit.userId = user._id;
//   ambit.checkIns = [];
//   // TODO: create unique refId
//   ambit.refId = Math.round(Math.random()*10000);

//   findAmbit({
//     refId: ambit.refId,
//     userId: ambit.userId
//   })
//     .then(function(found){
//       if (found) {
//         return next(new Error('Ambit refId already exists'));
//       } else {
//         return createAmbit(ambit);
//       }
//     })
//     .then(function (createdAmbit) {
//       if (createdAmbit) {
//         res.json(createdAmbit);
//       }
//     })
//     .fail(function (error) {
//       next(error);
//     });
// };


// module.exports.getAmbits = function(req, res, next) {
//   //send an array containing all the ambits back to the user.
//   var token = req.headers.token;
//   var user = jwt.decode(token, process.env.JWT_SECRET || 'ancient dev secret');
//   findAllAmbits({ userId: user._id })
//     .then(function(ambits){
//       console.log(ambits)
//       ambits.forEach(updateMissed);
//       res.send(ambits);
//       ambits.forEach(ambit => {
//         ambit.save();
//       })
//     })
//     .fail(function (error) {
//       next(error);
//     });
// };

