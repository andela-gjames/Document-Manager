var Role = require('../models/Role'),
    handleError = require('../helpers/ErrorsHelper').handleError;


module.exports.index = function(req, res){
  res.send("working");
}


module.exports.store = function(req, res){
  var role = new Role();
  role.title = req.body.title;
  role.save(function(err, role){
    if(err) return handleError(err, res);
    res.status(200).json({message: 'success'});
  });
}

module.exports.update = function(req, res){
  Role.update({title:req.params.title},
                    {$set:req.body}, function(err, status)
  {
      if(status.nModified == 0)
      {
        return res.status(404).json({ message: "Error updating, check your field"});
      }

      res.status(200).json({message:"success"});
  });
}

module.exports.destroy = function(req, res){
  Role.findOne({title: req.params.title}, function(err, role){

    if(err) return handleError(err, res);

    if(role != null){
      Role.remove({title: role.title}, function(err){
          if(err) return handleError(err, res);

          return res.status(200).json({message: 'item deleted'});
      });
    }

    return res.status(404).json({message: 'Not found'});
  });
}
