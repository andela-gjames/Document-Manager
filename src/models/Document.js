var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var documentSchema = new Schema({
    ownerId:{type:Schema.Types.ObjectId, required: true, ref:"User"},
    title : {type: String, required:true, unique: true, index:true},
    slug :{type: String, required:true, unique:true, index:true, lowercase: true},
    content : {type: String},
    role:{ type:Schema.Types.ObjectId, ref:"Role", required:true},
    dates :{
        createdAt : { type: Date, required: true},
        modifiedAt : { type: Date}
    }
});


module.exports = mongoose.model("Document", documentSchema);
