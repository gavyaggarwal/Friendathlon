module.exports = {
  start: function() {
    var config = require('./config.js'),
        db     = require('./db.js'),
        oauth  = require('oauth');


    var cursor;

    function task() {
      if (db.getInstance()) {
        if (cursor && !cursor.isClosed()) {
          cursor.next(function(err, item) {
            if (err) {
              // Most likely a database error
              console.log("Cron Job Error:", err);
            } else if (item && item.accessToken) {
              console.log("Token:", item.accessToken);
              config.oauth.get("https://api.moves-app.com/api/1.1/user/summary/daily/201608", item.accessToken, function(err, result, response) {
                if (err) {
                  console.log("error", err);
                } else {
                  var results = JSON.parse(result);
                  for (var i = 0; i < results.length; i++) {
                    var date = results[i].date;
                    var summary = results[i].summary;
                    console.log(date);
                    for (var j = 0; j < summary.length; j++) {
                      console.log(summary[j].activity, summary[j].distance);
                    }
                  }
                }
              });
            } else {
              // Access Token not Available
            }
          });
        } else {
          console.log("Refreshing Cursor");
          cursor = db.getInstance().collection('users').find();
        }
      }
    }

    setInterval(task, 6000);
  }
}
