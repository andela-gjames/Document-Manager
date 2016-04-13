var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

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


module.exports = mongoose.model("User", userSchema);
