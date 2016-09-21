var config = require('./config.js'),
    db     = require('./db.js'),
    logic  = require('./logic.js');

var request = require('request');
require('dotenv').config({silent: true});

function startMovesDataScraping() {


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

function sendNotification(recipient, message) {
  request.post('https://gcm-http.googleapis.com/gcm/send', {
    json: {
      "data": {
        "notification": {
          "subject": "Friendathlon",
          "message": message
        }
      },
      "to" : recipient
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key= ' + process.env.PUSH_NOTIFICATION_KEY
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log("Notification Sent")
    } else {
      //console.log(error, body);
    }
  });
}

function generateRibbonsNotifications() {
  function task() {
    var col = db.getInstance().collection('users');
    col.aggregate([
      { $project : { name : 1 , id : 1, friends: 1, notificationToken: 1 } },
      { $unwind: '$friends' },
      { $lookup: {
        from: "users",
        localField: "friends",
        foreignField: "id",
        as: "friendData"
      }},
      { $project : {
        name: 1,
        id: 1,
        friends: 1,
        notificationToken: 1,
        "friendData.todayActivities" : 1,
        "friendData.thisWeekActivities" : 1,
        "friendData.thisMonthActivities" : 1,
      }},
      { $group: { _id : "$id", friends: { $push: { friendData: "$friendData", notificationToken: "$notificationToken" } } } }
    ]).toArray(function(err, results) {
      console.log(err, results, JSON.stringify(results));
    });
  }

  setTimeout(task, 2000);
}

module.exports = {
  start: function() {
    startMovesDataScraping();
    //sendNotification("f3yh6BRJ0Bw:APA91bGLjnLNT0vzFcGOQ6o0SUOe33Gtmz3MalmxIxMuVn1TSTyfP2bRKpSGyuyV2rizzqdVm85GAUOB9lP598HBxUs9L-54sG_igcgqMD80cTSrHC3a72OVPJELh6j1XkWVc3HKjf2O", "Thanks for using this app. You're awesome!");
    //generateRibbonsNotifications();
  }
}
