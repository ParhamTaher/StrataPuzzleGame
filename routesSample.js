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