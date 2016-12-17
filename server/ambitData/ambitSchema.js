var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ambitSchema = new Schema({
  refId: {type: Number, index: true}, //a number used to keep track of the ambit
  userId: String,
  name: String,
  coords: {
    latitude: Number,
    longitude: Number
  },
  createdAt: Date,
  stats: {
    lastUpdate: Date,
    missed:{type: [Number], default: [0,0,0,0,0,0,0]},
    made:{type: [Number], default: [0,0,0,0,0,0,0]}
  },
  weekdays: [Boolean], //0 is Sunday, 6 is Saturday
  startDate: Date,
  startTime: String,
  checkIns: [Date] // a history of successful check-ins
  //time (when during the day are you supposed to check in)
  //repeats (every week? every other week? is this necessary?)
});

ambitSchema.pre('save', function(next){
  now = new Date();
  if (!this.created_at) {
    this.createdAt = now;
  }
  if (!this.stats.lastUpdate) {
    this.stats.lastUpdate = now;
  }
  next();
});

var Ambit = mongoose.model('Ambit', ambitSchema);

module.exports = Ambit;
