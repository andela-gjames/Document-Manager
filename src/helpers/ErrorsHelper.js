module.exports.handleError = function(err, resp) {
    if (err) {
        var msg = null
        var statusCode = 500;
        switch (errorObj.code) {
            case 11000:
                statusCode = 409;
                msg = "The value already exist"
                break;
            default:
                msg = "server error";
        }
        return res.status(statusCode).json(msg);
    }
}
