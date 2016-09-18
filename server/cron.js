module.exports = {
  start: function() {
    var db = require('./db.js');

    var cursor;

    function task() {
      if (db.getInstance()) {
        if (cursor && !cursor.isClosed()) {
          cursor.next(function(err, item) {
            console.log(err, item);
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
