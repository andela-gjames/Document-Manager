var express = require("express"),
    UsersController = require('./controllers/UsersController'),
    RolesController = require('./controllers/RolesController');

var routes = express.Router();

module.exports.api = function() {
    //Users CRUD
    routes.get('/user', UsersController.index);
    routes.post('/user/', UsersController.store);
    routes.post('/user/login', UsersController.login);
    routes.put('/user/:username/', UsersController.update);
    routes.delete('/user/:username/', UsersController.destroy);

    //Roles CRUD
    routes.get('/role/', RolesController.index);
    routes.post('/role/', RolesController.store);
    routes.put('/role/:title/', RolesController.update);
    routes.delete('/role/:title/', RolesController.destroy);
    return routes;
}
