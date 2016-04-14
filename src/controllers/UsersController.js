var User = require("../models/User"),
    events = require('events'),
    EventEmitter = events.EventEmitter
    moment = require('moment')
    UserHelper = require('../helpers/UserHelper');

module.exports.index = function(req, res){
  res.setHeader("Content-Type", "application/json");
  UserHelper.verifyToken(req.get('token'), function(err, decoded, msg){
    if(err){
      res.statusCode = msg.statusCode;
      res.send({status:'Error', message: msg.message}).json();
    }else{
      res.send({status:'Success', message: 'Token decoded', user: decoded}).json();
    }
  });
}

module.exports.store = function(req, res){
  res.setHeader("Content-Type", "application/json");

  var user = new User;
  user.email = req.body.email;
  user.password = req.body.password;
  user.name.first = req.body.firstName;
  user.name.last = req.body.lastName;
  var date = new Date();
  user.dates.created = date;
  user.dates.updated = date;

  user.save(function(err, user){
    if(err) res.send(err);
    res.send(JSON.stringify(user));
  });
}

module.exports.login = function(req, res){

  User.validateUser(req.body.email, req.body.password, function(err, isValid, user){
    res.setHeader("Content-Type", "application/json");
    var msg = {};
    if (err) {
      msg.statusCode = 400;
      msg.status = "Error";
      msg.message = "An error has occured";

      res.statusCode = msg.statusCode;
      res.send(JSON.stringify(msg)).json();
    } else {
      if (isValid){
        msg.statusCode = 200;
        msg.status = "Success";
        msg.message = "Logged in";
        User.generateToken({
          email:user.email,
          firstName : user.name.first,
          lastName : user.name.last,
          dates :{
            created: moment(user.dates.created).format("MM Do YYYY"),
            updated: moment(user.dates.updated.toString()).fromNow()
          }
        }, function(err, token){

          if(err) return err;
          msg.token = token;
          res.statusCode = msg.statusCode;
          res.send(JSON.stringify(msg)).json();
        });
      } else {
        msg.statusCode  = 401;
        msg.status = "Failure";
        msg.message = "Invalid username or password";

        res.statusCode = msg.statusCode;
        res.send(JSON.stringify(msg)).json();
      }
    }
  });
}
