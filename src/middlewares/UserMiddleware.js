var User = require("../models/User");

module.exports.isUser = function(req, res, next){
    User.findOne({username: req.params.username}, function(err, user){
        if(req.body.jwt_user.username !==  user.username){
            return res.status(401).json({message:"Invalid operation"});
        }
        next();
    });
}
