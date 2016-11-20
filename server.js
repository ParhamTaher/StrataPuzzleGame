//Main server file

var express = require('express');
var router = express.Router();

var routes = require('./routes');

var path = require('path');

var app = express();
//Static CSS file
app.use(express.static(__dirname + '/assets/css'));
app.use(express.static(__dirname + '/'));


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;


//Link to routes.js
app.use('/', routes);


//Start server at port 3000
app.listen(port);
console.log("Listening on port " + port + "...");