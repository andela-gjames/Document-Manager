var Document = require('../models/Document')
var handleError = require('../helpers/ErrorsHelper').handleError
var moment = require('moment');

module.exports.index = function(req, res){
    //Get all and populate
    var query = Document.find({}).populate({
        path:'role',
        select : '-_id'
    }).populate({
        path:'ownerId',
        select:'name -_id email username '
    });

    //Limit search result by range
    var start = Math.abs(parseInt(req.query.q)) < 0  ? 0 : parseInt(req.query.q);
    var limit = parseInt(req.query.limit) ;
    query.skip(start).limit(limit);

    //Filter search result by date
    if(req.query.date !== undefined){
        var startOfDay = moment.utc(req.query.date,
            ["DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]).format();
        var endOfDay = moment.utc(req.query.date,
            ["DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]).endOf("day").format();

        query.where('dates.createdAt').gte(startOfDay).lte(endOfDay)
    }

    //Sort search result by date and then title
    query.sort({'dates.createdAt': 1});
    query.sort({title: -1});

    //Execute query
    query.exec(function(err, documents){
        // console.log(err);
        if(err) return handleError(err, res);

        //Filter search result and get only documents of specific roles
        if(req.query.role !== undefined){
            documents = documents.filter(function(doc){
                return doc.role.title === req.query.role;
            });
        }
        res.status(200).json(documents);
    });
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
