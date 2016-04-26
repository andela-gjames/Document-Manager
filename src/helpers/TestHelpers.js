


module.exports = function(mongoose){
    mongoose.connection.collections['users'].drop(function(err, result) {
        mongoose.connection.collections['documents'].drop(function(err, result) {
            mongoose.connection.collections['roles'].drop( function(err, result) {
                console.success('db clear')
            });
        });
    });
}
