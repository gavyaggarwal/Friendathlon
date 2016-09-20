var mongodb = require('mongodb');

var mongoURL      = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
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

var db        = null,
    dbDetails = new Object();


var initDb = function(callback) {
  if (mongoURL == null) return;

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

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

module.exports = {
  getInstance: function() {
    if (!db) {
      initDb(function(err){});
    }
    return db;
  },
  debugDump: function() {
    var col = db.collection('users');
    col.find().toArray(function(err, documents) {
      console.log(documents);
    });
    var col = db.collection('activities');
    col.find().toArray(function(err, documents) {
      //console.log(documents);
    });
  },
  debugClear: function() {
    db.collection('users').remove({});
    db.collection('activities').remove({});
  }
}
