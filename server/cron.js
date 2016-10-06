var config        = require('./config.js'),
    db            = require('./db.js'),
    logic         = require('./logic.js'),
    notifications = require('./notifications.js');

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

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

  setInterval(task, 2 * ONE_SECOND);
}

function generateCompetitionNotifications() {
  function periodMap(time) {
    const headers = {
      "day" : "today",
      "week" : "this week",
      "month" : "this month"
    };
    return headers[time];
  }
  function getDistance(person, activity, period) {
    if (person == undefined) {
      return 0;
    }
    var activityContainer;
    switch (period) {
      case "day":
        activityContainer = person.todayActivities;
        break;
      case "week":
        activityContainer = person.thisWeekActivities;
        break;
      case "month":
        activityContainer = person.thisMonthActivities;
        break;
      default:
        break;
    }
    if (activityContainer == undefined) {
      return 0;
    }
    return activityContainer[activity] || 0;
  }

  function task() {
    console.log("Sending Competitive Notifications")
    if (db.getInstance()) {
      var col = db.getInstance().collection('users');
      col.aggregate([
        { $project : { name : 1 , id : 1, friends: 1, todayActivities: 1, thisWeekActivities: 1, thisMonthActivities: 1,} },
        { $unwind: '$friends' },
        { $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "id",
          as: "friendData"
        }},
        { $project : {
          my_info: {
            name: "$name",
            id: "$id",
            todayActivities: "$todayActivities",
            thisWeekActivities: "$thisWeekActivities",
            thisMonthActivities: "$thisMonthActivities",
          },
          "friendData.name" : 1,
          "friendData.todayActivities" : 1,
          "friendData.thisWeekActivities" : 1,
          "friendData.thisMonthActivities" : 1,
        }},
        { $group: { _id : "$my_info", friends: { $push: { friendData: "$friendData" } } } }
      ]).each(function(err, item) {
        if (item != null) {
          try {
            var me = item._id;
            var friend = item.friends[Math.floor(Math.random() * (item.friends.length))].friendData[0];
            var periods = ["day", "week", "month"];
            var activities = ["walking", "running", "cycling"];
            var firstName = friend.name.substr(0, friend.name.indexOf(' '));

            for (var i = 0; i < periods.length; i++) {
              var period = periods[i];
              for (var j = 0; j < activities.length; j++) {
                var activity = activities[j];
                var myDistance = getDistance(me, activity, period);
                var friendDistance = getDistance(friend, activity, period);
                if (myDistance > 0 && friendDistance > 0) {
                  if (myDistance > friendDistance) {
                    notifications.sendNotificationIfReady(me.id, "Keep up the good work! You're beating " + firstName + " in the " + activity + " leaderboard for " + periodMap(period) + ".");
                    return;
                  } else {
                    notifications.sendNotificationIfReady(me.id, "Step it up! " + firstName + " is beating you in the " + activity + " leaderboard for " + periodMap(period) + ".");
                    return;
                  }
                }
              }
            }
          } catch (e) {
            console.log("Caught Error:", e);
          }
        }
      });
    }
  }
  setInterval(task, 30 * ONE_MINUTE);
}

module.exports = {
  start: function() {
    startMovesDataScraping();
    generateCompetitionNotifications();
  }
}
