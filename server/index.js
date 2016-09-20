/*
 * Available APIs:
 *
 * /updateProfile (POST) - Call this everytime the app is launched
 * Request Body: {
 *                 "id": <FBID>,
 *                 "friends": [<FBFRIENDID>,...],
 *                 "name": <FB NAME>,
 *                 "location": <LOCATION STRING (eg. Newark, DE)>
 *               }
 *
 * /viewProfile (GET) - Returns information for a user
 * Request Parameters: id=<FBID>
 *
 * /genericLeaderboard (GET) - Returns generic leaderboards for a user
 * Request Parameters: id=<FBID>
 *
 * /specificLeaderboard (GET) - Returns specific leaderboard for a user/activity
 * Request Parameters: id=<FBID>&activity=<activity>
 */

var express    = require('express'),
    bodyParser = require('body-parser'),
    fs         = require('fs'),
    assert     = require('assert'),
    app        = express(),
    eps        = require('ejs'),
    morgan     = require('morgan'),
    db         = require('./db.js'),
    config     = require('./config.js'),
    cron       = require('./cron.js');


Object.assign=require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';



function verifyDB(req, res, next) {
    if (db.getInstance()) {
      req.db = db.getInstance();
      next();
    } else {
      res.status(500).send(JSON.stringify({"success": false}));
    }
}

function sendObject(res, obj) {
  obj["success"] = true;
  res.send(JSON.stringify(obj));
}

function getDistances(item, activity) {
  return {
    day: item.todayActivities ? (item.todayActivities[activity] || 0) : 0,
    week: item.thisWeekActivities ? (item.thisWeekActivities[activity] || 0) : 0,
    month: item.thisMonthActivities ? (item.thisMonthActivities[activity] || 0) : 0
  }
}

app.post('/updateProfile', verifyDB, function (req, res) {
  assert(req.body.id);
  assert(req.body.friends);
  assert(req.body.name);
  var col = req.db.collection('users');
  col.updateOne(
    { "id": req.body.id },
    {
      $set: {
        "friends": req.body.friends,
        "name": req.body.name,
        "location": req.body.location
      },
      $currentDate: { "lastModified": true }
    },
    {
      upsert: true
    }, function(err, results) {
      sendObject(res, {});
  });
});

app.get('/viewProfile', verifyDB, function (req, res) {
  assert(req.query.id);

  result = {
    ribbons: ['walking', 'cycling', 'running'],
    medals: ['cycling']
  };
  data = {};

  function sendIfReady() {
    if(data.walking && data.running && data.cycling) {
      sendObject(res, result);
    }
  }

  var col = db.getInstance().collection('activities');
  var max = col.findOne({
    $query: {
      "id": req.query.id,
      "activity": "walking"
    },
    $orderBy: {"distance": -1}
  }, function(err, item) {
    data.walking = true;
    if (err) {
      console.log("DB Error: ", err);
    } else if (item == null) {
      result.walkingRecord = 0;
    } else {
      result.walkingRecord = item.distance;
    }
    sendIfReady();
  });

  var col = db.getInstance().collection('activities');
  var max = col.findOne({
    $query: {
      "id": req.query.id,
      "activity": "running"
    },
    $orderBy: {"distance": -1}
  }, function(err, item) {
    data.running = true;
    if (err) {
      console.log("DB Error: ", err);
    } else if (item == null) {
      result.runningRecord = 0;
    } else {
      result.runningRecord = item.distance;
    }
    sendIfReady();
  });

  var col = db.getInstance().collection('activities');
  var max = col.findOne({
    $query: {
      "id": req.query.id,
      "activity": "cycling"
    },
    $orderBy: {"distance": -1}
  }, function(err, item) {
    data.cycling = true;
    if (err) {
      console.log("DB Error: ", err);
    } else if (item == null) {
      result.cyclingRecord = 0;
    } else {
      result.cyclingRecord = item.distance;
    }
    sendIfReady();
  });
});

app.get('/genericLeaderboard', verifyDB, function (req, res) {
  assert(req.query.id != undefined);
  var supportedActivities = ["walking", "running", "cycling"];
  var leaderboards = [];

  var col = db.getInstance().collection('users');
  col.aggregate([
    { $match: { "id": req.query.id } },
    { $unwind: '$friends' },
    { $lookup: {
      from: "users",
      localField: "friends",
      foreignField: "id",
      as: "friendData"
    }}
  ]).toArray(function(err, result) {
       assert.equal(err, null);
       if (result.length == 0) {
         var max = col.findOne({
           "id": req.query.id
         }, function(err, item) {
           for (var i = 0; i < supportedActivities.length; i++) {
             var activity = supportedActivities[i];

             var distances = getDistances(item, activity);
             if (distances.month == 0) {
               continue;
             }
             leaderboards.push({
               activity: activity,
               daily: {
                 distance: distances.day,
                 rank: 1,
                 total: 1
               },
               weekly: {
                 distance: distances.week,
                 rank: 1,
                 total: 1
               },
               monthly: {
                 distance: distances.month,
                 rank: 1,
                 total: 1
               }
             });
           }
           sendObject(res, {leaderboards: leaderboards});
         });
       } else {
         for (var i = 0; i < supportedActivities.length; i++) {
           var activity = supportedActivities[i];
           var ranks = {
             day: 1,
             week: 1,
             month: 1
           };
           var counts = {
             day: 1,
             week: 1,
             month: 1
           };
           var myDistances = getDistances(result[0], activity);
           for (var j = 0; j < result.length; j++) {
             var friend = result[j].friendData[0];

             var friendDistances = getDistances(friend, activity);

             if (myDistances.month == 0) {
               continue;
             }

             if (friendDistances.day > myDistances.day) {
               ranks.day++;
             }
             if (friendDistances.week > myDistances.week) {
               ranks.week++;
             }
             if (friendDistances.month > myDistances.month) {
               ranks.month++;
             }
             if (friendDistances.day > 0) {
               counts.day++;
             }
             if (friendDistances.week > 0) {
               counts.week++;
             }
             if (friendDistances.month > 0) {
               counts.month++;
             }
           }
           leaderboards.push({
             activity: activity,
             daily: {
               distance: myDistances.day,
               rank: ranks.day,
               total: counts.day
             },
             weekly: {
               distance: myDistances.week,
               rank: ranks.week,
               total: counts.week
             },
             monthly: {
               distance: myDistances.month,
               rank: ranks.month,
               total: counts.month
             }
           });
         }
         sendObject(res, {leaderboards: leaderboards});
       }
     });


     /*
  sendObject(res, {
    leaderboards: [
      {
        activity: "walking",
        daily: {
          distance: 3.4,
          rank: 3,
          total: 5
        },
        weekly: {
          distance: 14,
          rank: 5,
          total: 19
        },
        monthly: {
          distance: 39,
          rank: 8,
          total: 24
        }
      },
      {
        activity: "running",
        daily: {
          distance: 0.5,
          rank: 4,
          total: 5
        },
        weekly: {
          distance: 0.5,
          rank: 12,
          total: 19
        },
        monthly: {
          distance: 4,
          rank: 12,
          total: 24
        }
      }
    ]
  });*/
});

app.get('/specificLeaderboard', verifyDB, function (req, res) {
  assert(req.query.id != undefined);
  assert(req.query.activity != undefined);
  sendObject(res, {
    stats: {
      friendRank: 3,
      friendTotal: 19,
      ribbonOnTrack: true,
      //percentile: 5,
      totalDistance: 38.1,
      averageDistance: 2
    },
    friends: [
      {
        rank: 1,
        name: "Gavy Aggarwal",
        location: "Newark, DE",
        distance: 5.7,
        progress: 1,
        me: false
      },
      {
        rank: 2,
        name: "Abirami Kurinchi-Vendhan",
        location: "Hillsboro, OR",
        distance: 4.9,
        progress: 0.85,
        me: false
      },
      {
        rank: 3,
        name: "John Doe",
        location: "Austin, TX",
        distance: 4.0,
        progress: 0.6,
        me: true
      },
      {
        rank: 4,
        name: "Sarah Johnson",
        location: "Pasadena, CA",
        distance: 1.7,
        progress: 0.4,
        me: false
      },
      {
        rank: 5,
        name: "Jacob Smith",
        location: "Seattle, WA",
        distance: 0.2,
        progress: 0.1,
        me: false
      }
    ]
  });
});

app.get('/auth', verifyDB, function (req, res) {
  config.oauth.getOAuthAccessToken(
    req.query.code,
    {
      'grant_type': 'authorization_code',
      'redirect_uri': req.protocol + '://' + req.get('host') + '/auth',
      'state': req.query.state
    },
    function (e, access_token, refresh_token, results) {
      if (e) {
        console.log("EA", e);
        //res.end(e);
        res.redirect('friendathlon://');
      } else if (results.error) {
        console.log("TKNERR", results);
        //res.end(JSON.stringify(results));
        res.redirect('friendathlon://');
      } else {
        console.log('Obtained access_token: ', access_token);

        var col = req.db.collection('users');
        col.updateOne(
          { "id": req.query.state },
          {
            $set: {
              "accessToken": access_token,
              "refreshToken": refresh_token
            },
            $currentDate: { "lastModified": true }
          },
          {
            upsert: true
          }, function(err, results) {
            res.redirect('friendathlon://');
        });
      }
  });

});

app.get('/', verifyDB, function (req, res) {
  db.debugDump();
  console.log(req.protocol + '://' + req.get('host') + '/token');


  config.oauth.get("https://api.moves-app.com/api/1.1/user/summary/daily/20160805", "Fa_Aua20QI8rkRt1OqD8GMxl8Q7Jg2VuwJwHWRiIqetp2yu4h2mqu0kIQf8G4wxE", function(err, result, response) {
    if (err) {
      console.log("error", err);
    } else {
      sendObject(res, JSON.parse(result));
    }
  });

  /*
  var col = req.db.collection('counts');
  // Create a document with request IP and current time of request
  col.insert({ip: req.ip, date: Date.now()});
  col.count(function(err, count){
    res.send(JSON.stringify({ pageCountMessage : count, dbInfo: dbDetails }));
  });*/
});

app.get('/pagecount', verifyDB, function (req, res) {
  req.db.collection('counts').count(function(err, count ){
    res.send('{ pageCount: ' + count + '}');
  });
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send(JSON.stringify({"success": false}));
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

cron.start();

module.exports = app;
