var express = require("express"),
    UsersController = require('./controllers/UsersController');

var routes = express.Router();

module.exports.api = function(){
  routes.get('/user', UsersController.index);
  routes.post('/user/register', UsersController.store);
  routes.post('/user/login', UsersController.login);
  return routes;
}
