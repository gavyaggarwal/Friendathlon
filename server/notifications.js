var config  = require('./config.js'),
    db      = require('./db.js'),
    logic   = require('./logic.js'),
    request = require('request');

require('dotenv').config({silent: true});

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

var handlers = {
  userArrivedHome: function(item) {
    console.log("userArrivedHome Notification Would Be Sent Here");
  }
};

function postNotification(recipient, message) {
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

function sendNotificationIfReady(userID, message) {
  var col = db.getInstance().collection('users');
  col.findOne({
    id: userID
  }, function(err, item) {
    if(err) {
      console.error(err);
    } else if (item && item.notificationToken) {
      var lastDate = item.lastNotificationDate;
      var now = new Date();
      if (!lastDate || (now - lastDate) > ONE_DAY) {
        postNotification(item.notificationToken, message);
        col.updateOne(
          { "id" : userID },
          {
            $set: { "lastNotificationDate": now },
            $currentDate: { "lastModified": true }
          });
      }
    }
  });
}

module.exports = {
  postNotification: postNotification,
  sendNotificationIfReady: sendNotificationIfReady,
  handlers: handlers
}
