var Document = require('../models/Document')
var Role = require('../models/Role')
var handleError = require('../helpers/ErrorsHelper').handleError

module.exports.createDocObj = function(req, res, next){

    if(req.body.role == null){
        return res.status(400).json({message:'Role is required'});
    }
    Role.findOne({title: req.body.role}, function(err, role){
        if(err) return handleError(err, res);
        if(role == null){
            return res.status(400).json({message: 'role does not exist'});
        }
        var document = {}
        var date = new Date();
        document.ownerId = req.body.jwt_user._id;
        document.title = req.body.title;
        document.role = role._id;
        document.slug = req.body.title.replace(/\s+/g, "-");
        document.content = req.body.content;
        document.dates = {
            createdAt: date,
            modifiedAt : date
        };
        req.body.document = document;

        next();
    });
};

module.exports.isOwner = function(req, res, next){
    Document.findOne({slug: req.params.slug}, function(err, document){
        if(document.ownerId != req.body.jwt_user._id){
            return res.status(401).json({message: "You cannot perform this operation"})
        }
        next();
    });
}
