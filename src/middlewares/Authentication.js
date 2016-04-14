var jwt  = require('jsonwebtoken')
var User = require('../models/User');
var handleError = require('../helpers/ErrorsHelper').handleError;


module.exports.isAuthenticated = function(req, res, next){
    var token  = req.get('token');

    if(token === undefined || token === null){
        return res.status(403).send({message:'Login to access'});
    }

    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
        handleError(err, res);
        req.body.jwt_user = JSON.stringify(decoded);
        next();
    });
}

module.exports.isOwner = function(req, res, next){
    // User.findOne({username:});
    next();
}
