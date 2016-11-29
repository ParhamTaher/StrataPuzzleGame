"use strict";


var express = require('express');
var router = express.Router();
var session = require('client-sessions');

//Start session for persistent login times
router.use(session({
  cookieName: 'session',
  secret: 'nobeginningmiddleend',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//Connect to DB

/*
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '138.51.250.169',
  user: 'danniel5_user',
  password: '6j4v6NdfFH',
  database: 'danniel5_csc309'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
});
*/


/*

connection.query('SELECT * from User', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();
*/


//Routes
router.get('/', function(req, res) {
	res.sendFile('game.html', {'root':__dirname});
});


router.post('/register', function(req, res) {
	console.log(req.body);



	//ask them to log in once registered
});



router.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
    if (!user) {
      res.send("Invalid username or password.");
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.sendFile('community.html', {'root':__dirname});
      } else {
        res.send("Invalid username or password.");
      }
    }
  });
});



router.get('/profile', function(req, res) {
	//If user not logged in, send login page
	if (!req.user) {
    	res.sendFile('mode.html', {'root':__dirname});
  } else {
    	//res.sendFile('profile.html', {'root':__dirname});
  }

	
	
});


//Redirect to create page
router.get('/create', function(req, res) {
	res.sendFile('create.html', {'root':__dirname});
});


//Create/submit new pattern
router.post('/newpattern', function(req, res) {
	
});



module.exports = router;