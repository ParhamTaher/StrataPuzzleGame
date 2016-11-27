"use strict";


var express = require('express');
var router = express.Router();
var session = require('client-sessions');


router.use(session({
  cookieName: 'session',
  secret: 'nobeginningmiddleend',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//Routes
router.get('/', function(req, res) {
	res.sendFile('game.html', {'root':__dirname});
});


router.post('/register', function(req, res) {
	console.log(req.body);
});


/*
router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      res.render('login.jade', { error: 'Invalid email or password.' });
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', { error: 'Invalid email or password.' });
      }
    }
  });
});
*/


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