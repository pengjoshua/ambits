var express = require('express');
var bodyParser = require('body-parser');
var ambitHelper = require('./ambitData/ambitHelper.js');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');

// To use on Heroku, set the environment variable:
// $ heroku set:config MONGOLAB_URL=mongodb://user:password@mongolabstuff
var db = (process.env.MONGOLAB_URL || 'mongodb://localhost/ambits');
mongoose.connect(db);

var Ambit = require('./ambitData/ambitSchema');
var User = require('./users/userModel');

// if (process.env.NODE_ENV !== 'production') {
//   require('longjohn');
// }

var ctrlAuth = require('./controllers/authentication');

require('./config/passport');


if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack-dev-server.config.js');
  const compiler = webpack(config);

  // console.log(config.output.publicPath, config.output.path);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
  }));

  // app.use(webpackHotMiddleware(compiler, {
  //   log: console.log
  // }));

}


app.use(bodyParser.json());



const staticPath =  (process.env.NODE_ENV === 'production') ?
  path.resolve(__dirname, '../client/dist') :
  path.resolve(__dirname, '../client/src/www');


app.use(express.static(staticPath));
app.set('views',staticPath);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Should be refactored to go under /api
// Also, probably, to be rehandled in an external routehandler/ctrlrs
app.get('/ambits', ambitHelper.getAmbits);
app.post('/ambits', ambitHelper.addAmbit);

app.post('/ambits/:id', ambitHelper.saveCheckIn);

app.post('/register', ctrlAuth.register);
app.post('/login', ctrlAuth.login);

//prevents a "cannot GET" error on page reload by redirecting to main page
app.get('*', function (req, res) {
    res.redirect('/');
});

// DB testing paths; remove when endpoints are built
app.get('/db_post', function(req, res, next) {
  var elapsed = Math.floor(Math.random()*100000);
  var newLocation = new Location({
    name: 'Testy McUserson',
    geodata: elapsed
  });
  newLocation.save().then(function(newLocation) {
    console.log('POSTED: ', newLocation);
    res.json(newLocation);
  }).catch(function(err) {
    next(err);
  });

});

app.get('/db', function(req, res, next) {
  Location.find().then(function(locations) {
    res.json(locations);
  })
  .catch(function(err) {
    next(err);
  });
});

// To use on Heroku, must use port provided by process.env:
var port = (process.env.PORT || 3000);
app.listen(port, function() {
  console.log('Server is now listening at port ' + port)
});
