var user = require('../models/User')
    jwt  = require('jsonwebtoken');

var UserHelper = function(){

}

UserHelper.verifyToken = function (token, callback) {
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
      if(err){
        var msg = {};
        switch (err.name) {
          case 'TokenExpiredError':
            msg.message = "Token has expired, login to access";
            msg.statusCode = 401;
            break;
          case 'JsonWebTokenError':
            msg.message = 'Server error';
            msg.statusCode = 500;
            break;
          default:
            msg.message = "There has been an error, try again";
            msg.statusCode = 501;
        }
        callback(err, null, msg);
      }
      else
        callback(null, decoded, null);
  });
};

module.exports = UserHelper;
