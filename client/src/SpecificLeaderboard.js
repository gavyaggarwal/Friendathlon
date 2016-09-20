/*
TODO: Update friends list on server each time app is started
*/

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

import Styles from './Styles';

class UserCard extends Component {
  render () {
    return (
    <View style={localStyles.userCard}>
      <Text style={localStyles.rankView}>{this.props.data.rank}</Text>
      <Text style={localStyles.rankView}>{this.props.data.name}</Text>
      <Text style={localStyles.rankView}>{this.props.data.location}</Text>
      <Text style={localStyles.rankView}>{this.props.data.distance}</Text>
      <Text style={localStyles.rankView}>{this.props.data.progress}</Text>
      <Text style={localStyles.rankView}>{this.props.data.me}</Text>
    </View>
  )}
}

export default class SpecificLeaderboard extends Component {
  pastTense(verb) {
    const pastTense = {
      "walking" : "walked",
      "running" : "ran",
      "cycling" : "cycled"
    };
    return pastTense[verb];
  }

  header(verb) {
    const headers = {
      "walking" : "Walking",
      "running" : "Running",
      "cycling" : "Cycling"
    };
    return headers[verb];
  }

  periodMap(time) {
    const headers = {
      "day" : "today",
      "week" : "this week",
      "month" : "this month"
    };
    return headers[verb];
  }

  constructor(props) {
    super(props);
    var userID = props.userID;
    var activity = "walking";
    var period = "week";

    var that = this;
    (async function() {
      try {
        let response = await fetch('http://www.friendathlon.com/specificLeaderboard?id=' + userID + '&activity=' + activity + '&time=' + period);
        let json = await response.json();
        that.setState(json);
      } catch(error) {
        console.error(error);
      }
    })();

    this.state = null;

  }
  render() {
    if (this.state == null) {
      return (
        <View style={Styles.container}>
          <ScrollView style={localStyles.scrollView}>
            <Text style={localStyles.heading}>Title</Text>
          </ScrollView>
        </View>
      )
    } else {
      var heading = "";
      var ranking = "";
      var ribbonOnTrack = "";
      switch (this.state.stats.friendRank) {
        case 1:
          heading = "Fantastic Job! ";
          ranking = "1st";
          ribbonOnTrack = ", and you're on track for a ribbon";
          break;
        case 2:
          heading = "Great Job! ";
          ranking = "2nd";
          ribbonOnTrack = ", and you're on track for a ribbon";
          break;
        case 3:
          heading = "Good Job! ";
          ranking = "3rd";
          break;
        default:
          heading = this.state.stats.friendRank + "th"
          break;
      }
      var friends = "friends";
      if (this.state.stats.friendTotal == 1) {
        friends = "friend";
      }
      return (
        <View style={Styles.container}>
          <ScrollView style={localStyles.scrollView}>
            <Text style={localStyles.heading}>{this.state.title}</Text>
            <Text style={localStyles.caption}>
              {heading}You ranked {ranking} out of your {this.state.stats.friendTotal} {friends}{ribbonOnTrack}.
              Your {this.state.stats.friendTotal} {friends} {this.pastTense(activity)} a total of {Math.round(this.state.stats.totalDistance * 0.000621371)} miles {this.periodMap(period)}.
              That's an average of {Math.round(this.state.stats.averageDistance * 0.000621371)} miles per person so far.
            </Text>
            { this.state.friends.map(function(user) {
              return <UserCard data={user} key={user.rank}></UserCard>;
            }) }
          </ScrollView>
        </View>
      );
    }

  }
}

var localStyles = StyleSheet.create({
  userCard: {
    marginTop: 4,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 4,
    flex: 1,
    flexDirection: "row"
  },
  rankView: {
    backgroundColor: 'yellow',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'alegreyasans',
  },
  scrollView: {
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 'bold',
    fontFamily: 'alegreyasans',
    color: '#00BCD4'
  },
  caption: {
    fontSize: 15,
    marginTop: 4,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 4,
    fontWeight: '500',
    fontFamily: 'alegreyasans',
    color: '#666666'
  },
});
