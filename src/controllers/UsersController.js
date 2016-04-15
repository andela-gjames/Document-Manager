var User = require('../models/User')
var moment = require('moment')
var UserHelper = require('../helpers/UserHelper')
var handleError = require('../helpers/ErrorsHelper').handleError

// Index controller method
module.exports.index = function(req, res) {
    UserHelper.verifyToken(req.get('token'), function(err, decoded, msg) {
        if(err) return handleError(err, res);

        res.send({
            status: 'Success',
            message: 'Token decoded',
            user: decoded
        }).json()
    });
}


//Controller to login registered users
module.exports.login = function(req, res) {

    User.validateUser(req.body.username, req.body.password, function(err, isValid, user) {
        if(err) return handleError(err, res);

        if (isValid) {
            User.generateToken({
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.name.first,
                lastName: user.name.last,
                dates: {
                    created: moment(user.dates.created).format("MM Do YYYY"),
                    updated: moment(user.dates.updated).fromNow()
                }
            }, function(err, token) {
                if(err) return handleError(err, res);

                return res.status(200).json({ token: token});
            });
        }
        else
        {
            res.status(401).json({message: 'Invalid username or password'});
        }
    });
}


//Controller to store new users
module.exports.store = function(req, res) {
    res.setHeader("Content-Type", "application/json");

    var user = new User;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.name.first = req.body.firstName;
    user.name.last = req.body.lastName;
    var date = new Date();
    user.dates.created = date;
    user.dates.updated = date;

    user.save(function(err, user) {
        if(err) return handleError(err, res);

        res.send(JSON.stringify(user));
    });
}


//Update user
module.exports.update = function(req, res) {

    var condition = { username: req.params.username };
    var fields = { $set: req.body };
    User.findOneAndUpdate(condition, fields, { new: true}, function(err, user) {
        if(err) return handleError(err, res);

        if (user === null) {
            return res.status(404).json({ message: "user not found"});
        }
        res.status(200).json({message: "user updated", user: user});
    });
}


//Delete a user
module.exports.destroy = function(req, res) {
    var condition = {
        username: req.params.username
    };

    User.findOneAndRemove(condition, function(err, user, result) {
        if(err) return handleError(err, res);

        if (user === null) {
            return res.status(404).json({ message: " user not found"});
        }

        res.status(200).json({message: user.username + " has been deleted"});
    });
}
