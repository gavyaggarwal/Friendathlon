/*
 * Available APIs:
 *
 * /updateProfile (POST) - Call this everytime the app is launched
 * Request Body: {"id": <FBID>, "friends":[<FBFRIENDID>,...]}
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
    assert     = require('assert');
    app        = express(),
    eps        = require('ejs'),
    morgan     = require('morgan');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
} else {
  mongoURL = "mongodb://localhost:27017/friendathlon";
}

var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

function debugDumpDB() {
  var col = db.collection('users');
  col.find().toArray(function(err, documents) {

    console.log(documents);

  });
}

function verifyDB(req, res, next) {
    if (!db) {
      initDb(function(err){});
    }
    if (db) {
      req.db = db;
      next();
    } else {
      res.status(500).send(JSON.stringify({"success": false}));
    }
}

function sendObject(res, obj) {
  obj["success"] = true;
  res.send(JSON.stringify(obj));
}

app.get('/test', verifyDB, function (req, res) {
  sendObject(res, {"appName":"Friendathlon"});
});

app.post('/updateProfile', verifyDB, function (req, res) {
  var col = req.db.collection('users');
  col.updateOne(
    { "id": req.body.id },
    {
      $set: { "friends": req.body.friends },
      $currentDate: { "lastModified": true }
    },
    {
      upsert: true
    }, function(err, results) {
      sendObject(res, {});
  });
});

app.get('/genericLeaderboard', verifyDB, function (req, res) {
  assert(req.query.id != undefined);
  sendObject(res, {
    leaderboards: [
      {
        activity: "walk",
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
        activity: "run",
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
  });
});

app.get('/specificLeaderboard', verifyDB, function (req, res) {
  assert(req.query.id != undefined);
  assert(req.query.activity != undefined);
  sendObject(res, {
    stats: {
      friendRank: 3,
      friendTotal: 19,
      ribbonOnTrack: true,
      percentile: 5,
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

app.get('/', verifyDB, function (req, res) {
  var col = req.db.collection('counts');
  // Create a document with request IP and current time of request
  col.insert({ip: req.ip, date: Date.now()});
  col.count(function(err, count){
    res.send(JSON.stringify({ pageCountMessage : count, dbInfo: dbDetails }));
  });
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

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
