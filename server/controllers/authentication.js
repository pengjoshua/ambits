var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jwt-simple');
var Q = require('q');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  register: function (req, res, next) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    if (!email || !username || !password) {
      res.status(400).json({
        message: "All fields required."
      });
    } else {
      findUser({ email: email })
        .then(function (user) {
          if (user) {
            res.status(400).json({
              message: 'User already exists.'
            });
            return null;
          } else {
            return createUser({
              email: email,
              username: username,
              password: password
            });
          }
        })
        .then(function (user) {
          if (user) {
            var token = jwt.encode(user, process.env.JWT_SECRET || 'ancient dev secret');
            res.json({"token": token});
          }
        })
        .fail(function (error) {
          next(error);
        });
    }

  },
  login: function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    // console.log(req.body);
    if (!email || !password) {
      res.status(400).json({
        message: 'All fields required.'
      });
    } else {
      passport.authenticate('local', function (err, user, info) {
        var token;
        if (err) {
          res.status(400).json({
            message: "Incorrect username or password"
          });
        }
        if (user) {
          token = jwt.encode(user, process.env.JWT_SECRET || 'ancient dev secret');
          res.json({token: token});
        } else {
          res.status(400).json({
            message: "Incorrect username or password."
          });
        }
      })(req, res);
    }
  }
};
