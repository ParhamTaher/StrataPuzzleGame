"use strict";


var express = require('express');
var router = express.Router();
var session = require('client-sessions');
var fs = require('fs');

var mysql = require('mysql');
//DB
/*
var connection = mysql.createConnection({
  host: '138.51.250.169',
  user: 'danniel5_user',
  password: '6j4v6NdfFH',
  database: 'danniel5_csc309'
});
*/

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'strataDB'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... ");    
  } else {
      console.log("Error connecting database ... ");    
  }
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
    	res.sendFile('profile.html', {'root':__dirname});
  	}

});


router.post('/login', function(req, res) {
  var un = req.body.username;
  var pw = req.body.password;

  //Search for username in db, if found:
  connection.query("SELECT 1 from stUser WHERE username=?", [un], function(err, rows, fields) {
      if (!err) {
        if(rows.length > 0) {
          //add cookie
          req.session.user = un;
          console.log(req.session.user);
          res.send("done logging in");
        } else {
          res.send("User not found, please register");
        }
      }
      else {
        console.log('Error while performing Query.');
      }
  });


	
});


router.get('/game', function(req, res) {
	res.sendFile('game.html', {'root':__dirname});
});

router.get('/community', function(req, res) {
  if(req.session && req.session.user) {
    res.sendFile('community.html', {'root':__dirname});
  } else {
    res.sendFile('mode.html', {'root':__dirname});
  }
});

router.get('/single', function(req, res) {
	res.sendFile('game.html', {'root':__dirname});
	//res.redirect('/userinfo?single=clicked');
});

router.get('/userinfo', function(req, res) {
	if(req.session && req.session.user) {
		console.log(req.session.user.username);
		res.send({board:['red','red','red','red'],username:req.session.user,verbose:'I am green'});
	}
});

router.post('/search', function(req, res) {
	console.log("Searching for "+req.body.keyword);
	res.send({
        patterns: [
          {
            pid:1,
            name: 'myPattern',
            src: 'patterndefault.png',
          }
        ],
        users: [
          {
            username:'un',
            src: 'avatar.png',  // pattern icon filename, e.g.'un.png'
          }
        ]
      })
});



router.post('/register', function(req, res) {
  var un = req.body.username;
  var pw = req.body.password;
  var ds = "normal_user";
	console.log("Registering " + un);



	connection.query("SELECT 1 from stUser WHERE Username=?", [un], function(err, rows, fields) {
  		if (!err) {
        if(rows.length > 0) {
          console.log("Username Taken");
        } else {
          var user_info  = {Username: un, Password: pw, Description: ds};
          console.log(user_info);
          connection.query("INSERT INTO stUser SET ?", user_info, function(err, rows, fields) {
            if (!err) {
              console.log("Inserted");
            } else {
              console.log("Cannot insert");
            }
          });
        }
    		console.log('The solution is: ', rows);
  		}
  		else {
   			console.log('Error while performing Query.');
  		}
	});


  res.send("Success");
  
});


router.get('/create', function(req, res) {
	res.sendFile('create.html', {'root':__dirname});
});


router.post('/newpattern', function(req, res) {
	console.log(req.body);
  var un = req.session.user;
  var nm = req.body.name;
  var pattern_info = {Name: req.body.name, Username: req.session.user};
  

  connection.query("INSERT INTO stPattern SET ?", pattern_info, function(err, rows, fields) {
    if (!err) {
      console.log("Inserted pattern info to stPattern");
    } else {
      console.log("Cannot insert into stPattern");
    }
  });
  

  connection.query("SELECT PID from stPattern WHERE Username=?", [un], function(err, rows, fields) {
      if (!err) {
        var pid = rows[0].PID;
        console.log(pid);
        var count = req.body.board.length;

        for(var i = 0; i < count; i++) {
          console.log(pid);
          var solution_info  = {PID: pid, EntryNumber: i, Color: req.body.board[i]};
          console.log(solution_info);
          
          connection.query("INSERT INTO stSolution SET ?", solution_info, function(err, rows, fields) {
          if (!err) {
            console.log("Inserted into Solution");
          } else {
             console.log("Cannot insert");
          }
          });
        
        }

      }
      else {
        console.log('Error while performing Query.');
      }
  });


	res.send("Pattern Saved!");
});


router.get('/about', function(req, res) {
	res.sendFile('about.html', {'root':__dirname});
});


module.exports = router;
