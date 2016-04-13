var User = require("../models/User");

module.exports.index = function(req, res){
  res.setHeader("Content-Type", "application/json");
  // User.find();
  // res.send(JSON.stringify());
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
  users.dates.updated = date;

  user.save(function(err, user){
    if(err) res.send(err);
    res.send(JSON.stringify(user));
  });
}
