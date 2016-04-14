var express = require("express");
var UsersController = require('./controllers/UsersController');
var RolesController = require('./controllers/RolesController');
var AuthMiddleware = require('./middlewares/Authentication');

var routes = express.Router();

module.exports.api = function() {
    //Users CRUD
    routes.post('/user', [AuthMiddleware.isAuthenticated], UsersController.index);
    // routes.post('/user/', UsersController.store);
    routes.post('/user/login', UsersController.login);
    routes.put('/user/:username/', [AuthMiddleware.isAuthenticated], UsersController.update);
    routes.delete('/user/:username/', [AuthMiddleware.isAuthenticated], UsersController.destroy);

    //Roles CRUD
    routes.get('/role/', RolesController.index);
    routes.post('/role/', RolesController.store);
    routes.put('/role/:title/', [AuthMiddleware.isAuthenticated], RolesController.update);
    routes.delete('/role/:title/', [AuthMiddleware.isAuthenticated], RolesController.destroy);
    return routes;
}
