"use strict";


var express = require('express');
var router = express.Router();
var session = require('client-sessions');
var fs = require('fs');


router.use(session({
  cookieName: 'session',
  secret: 'nobeginningmiddleend',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//Routes
// router.get('/game', function(req, res) {
// 	res.sendFile('game.html', {'root':__dirname});
// });

// Sample sending additional info (pattern, username, verbose) along with file
// http://localhost:3000/game?pid=45
// Source: http://stackoverflow.com/questions/17634456/using-express-to-send-a-modified-file
router.get('/game', function(req, res) {
  var pid = req.query.pid;

  if (!pid) {
    res.sendFile('game.html', {'root':__dirname});
  }else {
    fs.readFile('./game.html', 'utf-8', function(err, data) {
      if (err) { res.send(404); }
      else {
        var pid = req.query.pid;
        console.log('Sending pattern '+pid);
        res.contentType('text/html').send(data.replace("<!--serversays-->",
        "<div id=\"serversays\">"+
          JSON.stringify({board:['red','red','red','red'],username:'crocodile',verbose:'I am green'})
          +"</div>"));
      }
    });
  }
  
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