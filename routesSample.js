// Sample functions for routes that work with community client

router.get('/community', function(req, res) {
  fs.readFile('./community.html', 'utf-8', function(err, data) {
    if (err) { res.send(404); }
    else {
      res.contentType('text/html').send(data.replace("<!--serversays-->",
      "<div id=\"serversays\">"+

      JSON.stringify({
        username:'username',
        verbose: 'verbose',
        recentlyadded: [
          {
            pid:1,
            name: 'pattern name',
            author: 'author',
            src: 'patterndefault.png',  // pattern icon filename, e.g.'1.png'
            time: 'timeuploaded'  // An ideal one is sth like '2 days ago'
          }
        ],
        mostliked: [
          {
            pid:1,
            name: 'pattern name',
            author: 'author',
            src: 'patterndefault.png',
            likes: '3'
          }
        ],
        patterns: [
          {
            pid:1,
            name: 'pattern name',
            src: 'patterndefault.png'
          }
        ]
      })

      +"</div>"));
    }
  });
});

router.post('/search', function(req, res) {
  // Search for user or pattern (community)
  console.log("Searching for "+req.body.keyword);
  res.send(

      JSON.stringify({
        patterns: [
          {
            pid:1,
            name: 'pattern name',
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

    )
});

router.get('/admin', function(req, res) {
  // Get lists of all users and all patterns (admin only)
  // The function signature is TEMPERARY. Please redirect in login
  fs.readFile('./admin.html', 'utf-8', function(err, data) {
    if (err) { res.send(404); }
    else {
      res.contentType('text/html').send(data.replace("<!--serversays-->",
      "<div id=\"serversays\">"+

      JSON.stringify({
        username:'username',
        verbose: 'verbose',
        users: [
          {
            username:'username',
            desc: 'description',
            src: 'avatar.png',
          }
        ],
        patterns: [
          {
            pid:1,
            name: 'pattern name',
            author: 'author',
            src: 'patterndefault.png',
            time: 'timeuploaded',
            likes: 5
          }
        ]
      })

      +"</div>"));
    }
  });
});

router.get('/pattern', function(req, res) {
  // Get details of a pattern
  fs.readFile('./admin.html', 'utf-8', function(err, data) {
    if (err) { res.send(404); }
    else {
      res.contentType('text/html').send(data.replace("<!--serversays-->",
      "<div id=\"serversays\">"+

      JSON.stringify({
        username:'username',
        verbose: 'verbose',
        pattern: {
          pid:1,
          name: 'pattern name',
          author: 'author',
          src: 'patterndefault.png',
          time: 'timeuploaded',
          likes: 5,
          liked: false
        }
      })

      +"</div>"));
    }
  });
});


router.post('/deleteUser', function(req, res) {
  // Delete a user. (admin)
  // respond success/error
}

router.post('/deletePattern', function(req, res) {
  // Delete a pattern. (admin, and perhaps community)
  // respond success/error
}

router.post('/like', function(req, res) {
  // Recommend doing this last.
  // TOGGLE user like on a pattern
  // client provides {pid:Int}
  // respond with the new {liked:boolean, likes:Int}
}

// For GET/profile, if request sent from admin page, target username will be provided as QUERY 'username'