var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

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

userSchema.pre('save', function(next){
  var user  = this;
  bcrypt.genSalt(20, function(err, salt){
    var hash  = bcrypt.hashSync(user.password);
    user.password = hash;
    next()
  });
});
module.exports = mongoose.model("User", userSchema);
