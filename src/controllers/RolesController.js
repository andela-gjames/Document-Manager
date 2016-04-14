var Role = require('../models/Role'),
    errorsHelper = require('../helpers/ErrorsHelper').ErrorsHelper;


module.exports.index = function(req, res){
  res.send("working");
}


module.exports.store = function(req, res){
  var role = new Role();
  role.title = req.body.title;
  role.save(function(err, role){

    res.setHeader('Content-Type', 'appication/json')
    var msg = {};
    if(err){
      console.log(errorsHelper.getMessage(err));
      msg.statusCode = 500;
      msg.status = 'Error';
      errorMsg = errorsHelper.getMessage(err);
      msg.message  = errorMsg !== null ? errorMsg :"There was an error try again";
    }
    else {
      msg.statusCode = 200;
      msg.status = 'Success';
      msg.message = 'Role created';
    }
    res.statusCode = msg.statusCode;
    res.send(JSON.stringify(msg)).json();
  });
}


module.exports.update = function(req, res){
  Role.update({title:req.params.title},
                    {$set:req.body}, function(err, status)
  {
      var msg = {};
      if(status.nModified == 0)
      {
        msg.statusCode = 404;
        msg.status = "Failure";
        msg.message = "Error updating, check your fields";
      } else {
        msg.statusCode = 200;
        msg.status = "success";
        msg.message = "update complete";
      }
      res.statusCode = msg.statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(msg)).json();
  });
}


module.exports.destroy = function(req, res){
  Role.findOne({title: req.params.title}, function(err, role){
    var msg = {};

    if(err){
      msg.statusCode = 500;
      msg.status = "Error";
      msg.message = "An error has occured";

      res.statusCode = msg.statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(msg)).json();
    }


    if(role != null){
      Role.remove({title: role.title}, function(err){

        if(err)
        {
          msg.statusCode = 500;
          msg.status = "Error";
          msg.message = "An error has occured";
        } else {
          msg.statusCode = 200;
          msg.status = "success";
          msg.message = "Delete successful";
        }

        res.statusCode = msg.statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(msg)).json();
      });
    }
    else {
      msg.statusCode = 404;
      msg.status = "Failure";
      msg.message = "Not found";

      res.statusCode = msg.statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(msg)).json();
    }


  });
}
