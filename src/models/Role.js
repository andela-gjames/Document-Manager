var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var roleSchema = new Schema({
  title:{type:String, index:true, unique: true, required:true, lowercase:true}
});

module.exports = mongoose.model("Role", roleSchema);
