var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('jsonwebtoken'),
    uniqueValidator = require('mongoose-unique-validator');


//Define use data structure
var userSchema = new Schema({
  name :{
    first:{type:String, required: [true, 'first name is required']},
    last: {type:String, required: [true, 'last name is required']}
  },
  username: {type:String, required:[true, 'username is required'], index:true, unique:[true, 'username already exist'], lowercase:true},
  email: {type: String, required: [true, 'email is required'], unique: [true, 'email already exist'], match: /\S+@\S+\.\S+/},
  password: {type: String, required: [true, 'password is required']},
  role: [{type: Schema.Types.ObjectId, ref: 'Role'}],
  dates: {
    created:{type:Date, required:true},
    updated: {type: Date}
  }
});


//Validate user during login
userSchema.statics.validateUser = function(username, password, callback){
  this.model('User').findOne({'username':username}, function(err, user){
    if(user == null){
      return  callback(err, false, null);
    }
    else{
      bcrypt.compare(password, user.password, function(err, result){
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

//Modify returned data
userSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.password
  return obj
}

//Export Model
// userSchema.plugin(uniqueValidator, {message: 'This {PATH} already exists'});
module.exports = mongoose.model("User", userSchema);
