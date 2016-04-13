var express = require("express"),
    UsersController = require('./controllers/UsersController');

var routes = express.Router();

module.exports.api = function(){
  routes.get('/user', UsersController.index);
  routes.post('/user/', UsersController.store);
  return routes;
}
