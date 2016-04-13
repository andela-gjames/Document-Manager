var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
roles = ["editor","owner", "viewer"];

var roleSchema = new Schema({
  role:{type:String, enum:roles}
});

module.exports = mongoose.model("Role", roleSchema);
