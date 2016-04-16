var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name :{type:String, unique:true, index: true, required: true},
    users: [{type:Schema.Types.ObjectId, ref:'User'}],
    dates: {
      created:{type:Date, required:true},
      updated: {type: Date}
    }
});



module.exports = mongoose.model('Group', groupSchema);
