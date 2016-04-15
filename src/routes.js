var express = require("express")
var UsersController = require('./controllers/UsersController')
var RolesController = require('./controllers/RolesController')
var DocumentsController = require('./controllers/DocumentsController')
var AuthMiddleware = require('./middlewares/Authentication')
var UserMiddleware = require('./middlewares/UserMiddleware')
var DocMiddleware = require('./middlewares/DocumentsMiddleware');

var routes = express.Router();

module.exports.api = function() {
    //Users CRUD
    routes.get('/users', [AuthMiddleware.isAuthenticated], UsersController.index);
    routes.post('/user/', UsersController.store);
    routes.post('/user/login', UsersController.login);
    routes.put('/user/:username/', [AuthMiddleware.isAuthenticated], UsersController.update);
    routes.delete('/user/:username/',
        [
            AuthMiddleware.isAuthenticated,
            UserMiddleware.isUser

        ],
    UsersController.destroy);

    //Roles CRUD
    routes.get('/roles/', RolesController.index);
    routes.post('/role/', RolesController.store);
    routes.put('/role/:title/', [AuthMiddleware.isAuthenticated], RolesController.update);
    routes.delete('/role/:title/',
        [
            AuthMiddleware.isAuthenticated
        ],
        RolesController.destroy);

    //Documents CRUD
    routes.get('/documents', DocumentsController.index);
    routes.post('/document',
        [
            AuthMiddleware.isAuthenticated,
            DocMiddleware.createDocObj
        ],
        DocumentsController.store);

    routes.put('/document/:slug',
        [
            AuthMiddleware.isAuthenticated
        ],
        DocumentsController.update);

    routes.delete('/document:slug',
        [
            AuthMiddleware.isAuthenticated,
            DocMiddleware.isOwner
        ],
        DocumentsController.destroy);

    return routes;
}
