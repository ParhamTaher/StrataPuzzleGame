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


//################################################################
//###################### Log in/out related ######################
//################################################################

function loginCheck(req, res) {
  if(req.session && req.session.user) {
    return true;
  } else {
    res.redirect('mode.html');
    return false;
  }
}


//Start session for persistent login times
router.use(session({
  cookieName: 'session',
  secret: 'nobeginningmiddleend',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


router.get('/', function(req, res) {
  res.sendFile('mode.html', {'root':__dirname});
});



router.post('/register', function(req, res) {
  var un = req.body.username;
  var pw = req.body.password;
  console.log("Registering " + un);

  connection.query("SELECT * from User WHERE Username=?", [un], function(err, rows, fields) {
      if (!err) {
        if(rows.length > 0) {
          console.log("Username Taken");
          res.send(failed('Username occupied. Please try again'));
        } else {
          var user_info  = {Username: un, Password: pw, type: "user"};
          connection.query("INSERT INTO User SET ?", user_info, function(err, rows, fields) {
            if (!err) {
              console.log("Inserted"+user_info);
              req.session.user = un;
              res.send(success('Success register'));
            } else {
              console.log("Cannot insert"+user_info);
              res.send(failed('Database unavailable. Please try again'));
            }
          });
        }
      }
      else {
        console.log('Error while finding user.');
        res.send(failed('Database unavailable. Please try again'));
      }
  });
  
});


router.post('/login', function(req, res) {
  var un = req.body.username;
  var pw = req.body.password;

  //Search for username in db, if found:
  connection.query("SELECT * from User WHERE (username=? OR email=?) AND password=?", [un, un, pw], function(err, rows, fields) {
      if (!err) {
        if(rows.length > 0) {
          //add cookie
          req.session.user = un;
          console.log(req.session.user+" logged in");
          res.send(JSON.stringify({success: true, msg: "Done logging in"}));
        } else {
          res.send(JSON.stringify({success: false, msg: 'Username or password incorrect, please try again'}));
        }
      }
      else {
        console.log('Error while performing Query.');
        res.send(failed('Database unavailable. Please try again'));
      }
  });
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.send(success());
});


router.get('/userinfo', function(req, res) {
  if(req.session && req.session.user) {
    console.log(req.session.user);
    res.send({username:req.session.user,verbose:'SQL to be implemented'});
  }
});

//################################################################
//####################### Profile related ########################
//################################################################


router.get('/profile', function(req, res) {
  //If user not logged in, send login page
  if (!req.session.user) {
      res.sendFile('mode.html', {'root':__dirname});
    } else {
      res.sendFile('profile.html', {'root':__dirname});
    }

});

//################################################################
//######################### Game related #########################
//################################################################

router.get('/game', function(req, res) {
  req.session.pid = req.query.pid;
	res.sendFile('game.html', {'root':__dirname});
});


router.get('/single', function(req, res) {
  req.session.pid = undefined;
  res.sendFile('game.html', {'root':__dirname});
});

router.get('/gameData', function(req, res) {
  var pid = req.session.pid;
  if (!pid) {
    res.send(failed('Single player mode'));
  } else {
    connection.query("SELECT * from Solution WHERE PID=?", [pid], function(err, rows, fields) {
      if (!err) {
        if (rows.length<1) {
          res.send(failed('Pattern not found'));
        } else {
          res.send(success(rows[0].Board));
        }
      }
      else {
        console.log('Error while performing Query.');
        res.send(failed('Database unavailable. Please try again'));
      }
    });
  }
});

router.get('/levels', function(req, res) {
  res.sendFile('levels.json', {'root':__dirname});
});

//################################################################
//######################## Create related ########################
//################################################################

router.get('/create', function(req, res) {
  if (req.session.user) {
    res.sendFile('create.html', {'root':__dirname});
  } else {
    res.sendFile('mode.html', {'root':__dirname});
  }
});


router.post('/newpattern', function(req, res) {
  var un = req.session.user;
  var nm = req.body.name;
  var pattern_info = {Name: req.body.name, Username: req.session.user};
  var pid = -1;
  
// DB Transaction code recommended here
  connection.query("INSERT INTO Pattern SET ?", pattern_info, function(err, rows, fields) {
    if (!err) {
      var solution_info  = {PID: rows.insertId, Board: JSON.stringify(req.body.board)};
      console.log("Inserted "+solution_info+" into Pattern");
              
      connection.query("INSERT INTO Solution SET ?", solution_info, function(err, rows, fields) {
        if (!err) {
          console.log("Inserted into Solution");
          res.send(success('Success upload'));
        } else {
          console.log("Cannot insert");
          res.send(failed('Database unavailable. Please try again'))
        }
      });
    } else {
      console.log("Cannot insert into Pattern");
      req.send(failed('Database unavailable. Please try again'));
    }
  });
});

//################################################################
//####################### Community related ######################
//################################################################

router.get('/community', function(req, res) {
  if (loginCheck(req, res)) 
    res.sendFile('community.html', {'root':__dirname});
});



router.get('/communityData', function(req, res) {
  req.session.obj = {};
  req.session.done = 0;
  if(loginCheck(req, res)) {
    cDataSolo(req, res, 'recentlyadded', "SELECT *, timeStamp date FROM Pattern ORDER BY timeStamp DESC LIMIT 7;");
    cDataSolo(req, res, 'mostliked', "SELECT * FROM Pattern WHERE likes > 0 ORDER BY likes LIMIT 7;");
    cDataSolo(req, res, 'patterns', "SELECT * FROM Pattern ORDER BY Name LIMIT 100;");
  } 
})
    function cDataSolo(req, res, field, sql) {
      var lst = [];
      connection.query(sql,function(err, rows, fields) {
        if (!err) {
          for (let i=0; i<rows.length; i++) {
            lst.push({
              pid:rows[i].PID,
              name: rows[i].Name,
              author: rows[i].Username,
              src: rows[i].PID+".png",
              likes: rows[i].likes,
              time: rows[i].date
            })
          }
          cDataCallback(req, res, field, lst);
        } else {
          console.log("Cannot get communityData");
          res.send(failed());
          return;
        }
      });
    }
    function cDataCallback(req, res, field, lst) {
      req.session.done++;
      req.session.obj[field] = lst;
      if (req.session.done == 3) 
        res.send(success(JSON.stringify(req.session.obj)));
    }



router.post('/search', function(req, res) {
  req.session.sobj = {};
  req.session.sdone = 0;
  if (loginCheck(req, res)) {
    var w = req.body.keyword;
    searchSolo(req, res, 'patterns', "SELECT * FROM Pattern WHERE Name LIKE ? LIMIT 50;", w);
    searchSolo(req, res, 'users', "SELECT * FROM User WHERE Username LIKE ? LIMIT 50;", w);
  }
});
    function searchSolo(req, res, field, sql, w) {
      var lst = [];
      connection.query(sql, ['%'+w+'%'], function(err, rows, fields) {
        if (!err) {

          for (let i=0; i<rows.length; i++) {
            lst.push({
              pid:rows[i].PID,
              name: rows[i].Name,
              username: rows[i].Username,
              src: rows[i].PID?rows[i].PID:rows[i].Username+".png"
            })
          }
          searchCallback(req, res, field, lst);
        } else {
          console.log("Cannot search "+err);
          res.send(failed());
          return;
        }
      });
    }
    function searchCallback(req, res, field, lst) {
      req.session.sdone++;
      req.session.sobj[field] = lst;
      if (req.session.sdone == 2) 
        res.send(success(JSON.stringify(req.session.sobj)));
    }



//################################################################
//############################ Others ############################
//################################################################

router.get('/about', function(req, res) {
	res.sendFile('about.html', {'root':__dirname});
});

function success(msg) {
  return JSON.stringify({success: true, msg: msg});
}
function failed(msg) {
  JSON.stringify({success: false, msg: msg});
}


module.exports = router;
