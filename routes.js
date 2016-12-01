"use strict";


var express = require('express');
var router = express.Router();
var session = require('client-sessions');
var fs = require('fs');

var mysql = require('mysql');
//DB
var connection = mysql.createConnection({
  host: '138.51.250.169',
  user: 'danniel5_user',
  password: '6j4v6NdfFH',
  database: 'danniel5_csc309'
});


//Start session for persistent login times
router.use(session({
  cookieName: 'session',
  secret: 'nobeginningmiddleend',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


router.get('/', function(req, res) {
	res.sendFile('game.html', {'root':__dirname});
});


router.get('/profile', function(req, res) {
	//If user not logged in, send login page
	if (!req.session.user) {
    	res.sendFile('mode.html', {'root':__dirname});
  	} else {
    	res.redirect('/');
  	}
	
});


router.post('/login', function(req, res) {
	req.session.user = req.body;
	console.log(req.session.user);
	res.send("done logging in");
});


router.get('/game', function(req, res) {
	res.sendFile('game.html', {'root':__dirname});
});

router.get('/userinfo', function(req, res) {
	if(req.session && req.session.user) {
		console.log(req.session.user.username);
		res.send({board:['red','red','red','red'],username:req.session.user.username,verbose:'I am green'});
	}
});


router.post('/register', function(req, res) {
	console.log("Registering " + req.body.username);
	
	connection.connect(function(err) {
  	if (err) throw err
  		console.log('Connected to DB!');
	});


	connection.query('SELECT * from User', function(err, rows, fields) {
  		if (!err) {
    		console.log('The solution is: ', rows);
  		}
  		else {
   			console.log('Error while performing Query.');
  		}
	});

	/*

	User.findOne({ username: req.body.username }, function(err, user) {
		if (user) {
      		res.send("Username already taken!");
      	} else {
      		var user_reg = { Username: req.body.username, Password: req.body.password, Description: "N" };
			connection.query('INSERT INTO User SET ?', user_reg, function(err,res){
  				if(err) throw err;
  				console.log('Last insert ID:', res.insertId);
			});

			connection.end();

			res.redirect('/profile');
      	}
	});
	*/

});


module.exports = router;