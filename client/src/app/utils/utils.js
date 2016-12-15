import axios from 'axios';
import * as loginCtrl from '../login/loginCtrl';

//private helper functions:
var validateLocation = function (current, checkin) {
  const MIN_DIST_MILES = 0.15; // acceptable distance between ambit loc and checkin loc (units = miles)
  const MIN_DIST = MIN_DIST_MILES*1609.34; // acceptable distance between ambit loc and checkin loc (units = meters)

  var rad = function(x) {
    return x * Math.PI / 180;
  };
  //calculate the distance btw two points.
  var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meters
    var dLat = rad(p2.latitude - p1.latitude);
    var dLong = rad(p2.longitude - p1.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d); // returns the distance in meters
  };

  if (getDistance(current, checkin) < MIN_DIST) {
    return true;
  } else {
    return false;
  }
};

//calculate ambit frequency and process for display
const daysOftheWeek = function(boolArr) {
  var days = {
    0:'Su',
    1:'M',
    2:'Tu',
    3:'W',
    4:'Thu',
    5:'Fri',
    6:'Sa'
  };
  var result ='';
  var displayDays = boolArr.map((b, i) => {
    b ? days.i : b;
  }).filter(d => (!!d)).forEach((day, i, a) => {
    if(i === a.length) {
      result += day;
    } else {
      result += day + '/';
    }
  });
  return result;
};

//Decorate ambits for client side
const decorateAmbits = function(ambits) {
  ambits.forEach(ambit => {
    if(ambit.weekdays.every(day => day === true)) {
      ambit.frequency = 'Daily';
    } else {
      ambit.frequency = 'Weekly - '+ daysOftheWeek(ambit.weekdays);
    }
    //TODO: clean the server side check.
    //check if the user is already checked in for the day:
    //TODO: make the date time specific.
    var now = (new Date()).toDateString();
    var recentCheckin = null;
    if(ambit.checkIns.length) {
      recentCheckin = new Date(Date.parse(ambit.checkIns[ambit.checkIns.length - 1]))
    }
    if(recentCheckin && recentCheckin.toDateString() === now) {
      ambit.checkedIn = true;
    } else {
      ambit.checkedIn = false;
    }
  });
  return ambits;
};

const url = '';

const getToken = function() {
  return loginCtrl.getJwt();
}

//public functions:
export const postCheckin = function (ambitId, callback) {
  axios({
    method:'post',
    url:'/ambits/' + ambitId,
    contentType: 'application/json',
    headers: {
      'token': getToken()
    }
    }).then(function(response){

      callback(response);
    }).catch(function(err){
      console.log('err');
      throw err;
    });
};

export const postAmbit = function (ambit, callback){
  axios({
    method:'post',
    url:'/ambits',
    contentType: 'application/json',
    headers: {
      'token': getToken()
    },
    data: {
      ambit: ambit
    }
    }).then(function(response){
      callback(response, null);
    }).catch(function(error) {
      callback(null, error);
    });
};

export const getAllAmbits = function(callback) {
  let token = getToken();
  if (token) {
    axios({
      method: 'get',
      url: url + '/ambits',
      headers: {
        'token': token
      },
      contentType: 'application/json',
    }).then(function(response) {
      callback(decorateAmbits(response.data));
    }).catch(function(error){
      throw error;
    });
  } else {
    callback([]);
  }
};


export const checkinAmbit = function(ambit, successCb,errorCb) {
  //get current location
  if (navigator.geolocation) {
  /* geolocation is available */
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords);
    var coordinates = position.coords;
    if(validateLocation(ambit.coords, coordinates)) {
      console.log('valid');
      successCb();
    } else {
      //inform user that it is not a valid checkin attempt
      //cheating
      errorCb();
    }
  }, function(err) {
    throw err;
  }, {timeout: 10000});
 } else {
  //device does not support geolocation:
  console.log('your device does not support geolocation :(');
 }
};
