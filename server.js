var express = require('express'),
    dotenv = require('dotenv').config(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
    routes = require('./src/routes.js');

//Initialize express
var app = express();

//Connect to databse
mongoose.connect("mongodb://localhost/"+process.env.DB_NAME);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

//Set and use routes
app.use('/api', routes.api());


//Listen at port
app.listen(process.env.PORT, function(){
  console.log("Application running at " + process.env.PORT);
})

module.exports = app;
module.exports.mongoose = mongoose;
