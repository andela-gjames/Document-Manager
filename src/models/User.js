var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('jsonwebtoken');


//Define use data structure
var userSchema = new Schema({
  name :{
    first:{type:String, required: true},
    last: {type:String, required:true}
  },
  email: {type: String, required: true, unique: true, match: /\S+@\S+\.\S+/},
  password: {type: String, required: true},
  dates: {
    created:{type:Date, required:true},
    updated: {type: Date}
  }
});


//Validate user during login
userSchema.statics.validateUser = function(email, password, callback){
  this.model('User').findOne({'email':email}, function(err, user){
    if(user == null){
      return  callback(err, false, null);
    }
    else{
      bcrypt.compare(password, user.password, function(err, result){
          console.log(user.password);
          return callback(null, result, user);
      });
    }
  });
};


//Generate jwt token for verified users
userSchema.statics.generateToken = function(payload, callback){
  var err = null;
  if(typeof payload !== 'object'){
      err = new Error("Invalid payload");
  }
  callback(err, jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:3600*3}));
};


//Hash password before saving the user to the database
userSchema.pre('save', function(next){
  var user  = this;
  bcrypt.genSalt(20, function(err, salt){
    var hash  = bcrypt.hashSync(user.password);
    user.password = hash;
    next()
  });
});
module.exports = mongoose.model("User", userSchema);
