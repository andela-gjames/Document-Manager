module.exports.handleError = function(err, res) {
    if (err) {
        var msg = null
        var statusCode = 500;
        switch (err.code) {
            case 11000:
                statusCode = 409;
                msg = "The value already exist"
                break;
            default:
                msg = "server error";
        }
        if(err.name='JsonWebTokenError'){
            statusCode = 403;
            msg = err.message;
        }
        return res.status(statusCode).json({message:msg});
    }
}
