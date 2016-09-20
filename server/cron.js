module.exports = {
  start: function() {
    var config = require('./config.js'),
        db     = require('./db.js'),
        logic  = require('./logic.js');


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
              logic.refreshMovesData(item);
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

    setInterval(task, 2000);
  }
}
