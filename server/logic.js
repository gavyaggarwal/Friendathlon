var config = require('./config.js'),
    db     = require('./db.js');

function refreshMovesData(user, successCallback, invalidCallback) {
  var currDate = new Date();
  var monthStr = currDate.toISOString().substring(0,7).replace(/-/g, "");
  var url = "https://api.moves-app.com/api/1.1/user/summary/daily/" + monthStr;
  config.oauth.get(url, user.accessToken, function(err, result, response) {
    if (err) {
      if (err.statusCode == 401 && err.data == "expired_access_token") {
        // Invalid token
        if (invalidCallback) {
          invalidCallback();
        }
      }
      console.log("error", err);
    } else {
      var results = JSON.parse(result);
      var col = db.getInstance().collection('activities');
      var lastDay = {};
      var lastWeek = {};
      var lastMonth = {};
      for (var i = 0; i < results.length; i++) {
        var dateStr = results[i].date;
        var summary = results[i].summary;
        if (summary == null) {
          continue;
        }
        var date = new Date(dateStr / 10000, (dateStr % 10000 / 100) - 1, dateStr % 100);
        for (var j = 0; j < summary.length; j++) {
          var group = summary[j].group;
          var distance = summary[j].distance;
          col.updateOne(
            {
              "id": user.id,
              "activity": summary[j].activity,
              "date": date
            },
            {
              $set: {
                "group": group,
                "distance": distance,
                "duration": summary[j].duration
              },
              $currentDate: { "lastModified": true }
            },
            {
              upsert: true
            }, function(err, results) {
              //console.log(err, results);
          });
          var daysFromToday = (currDate.getTime() - date.getTime()) / 24 / 60 / 60 / 1000;
          if (daysFromToday < 1) {
            if (lastDay[group] == undefined) {
              lastDay[group] = 0;
            }
            lastDay[group] += distance;
          }
          if (daysFromToday < 7) {
            if (lastWeek[group] == undefined) {
              lastWeek[group] = 0;
            }
            lastWeek[group] += distance;
          }
          if (daysFromToday < 30) {
            if (lastMonth[group] == undefined) {
              lastMonth[group] = 0;
            }
            lastMonth[group] += distance;
          }
        }
      }
      var users = db.getInstance().collection('users');
      users.updateOne(
        { "id": user.id },
        {
          $set: {
            "todayActivities": lastDay,
            "thisWeekActivities": lastWeek,
            "thisMonthActivities": lastMonth
          },
          $currentDate: { "lastModified": true }
        },
        {
          upsert: true
        }, function(err, results) {
          if (successCallback) {
            successCallback();
          }
        });
    }
  });
}

module.exports = {
  refreshMovesData: refreshMovesData
};
