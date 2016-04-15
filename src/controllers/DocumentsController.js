var Document = require('../models/Document')
var handleError = require('../helpers/ErrorsHelper').handleError;

module.exports.index = function(req, res){

}

//Creates a new Document
module.exports.store = function(req, res){
    Document.create(req.body.document, function(err, document){
        // console.log(err);
        if(err) return handleError(err, res);
        if(document){
            return res.status(200).json({message:"document created"});
        } else {
            return res.status(500).json({message: "server error"});
        }
    });
}

//Updates a document
module.exports.update = function(req, res){
    var condition = {slug: req.params.slug};
    var fields = {$set: req.body};
    Document.findOneAndUpdate(condition, fields,  {new:true}, function(err, document){
        if(err) return handleError(err, res);

        res.status(200).json({message:"document updated"});
    });
}


module.exports.destroy = function(req, res){
    var condition = {slug: req.params.slug};
    Document.remove(condition, function(err, document){
        if(err) return handleError(err, res);

        return res.status(200).json({message: "document has been deleted "});
    });
}
