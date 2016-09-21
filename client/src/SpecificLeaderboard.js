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

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

class UserCard extends Component {
  render () {
    if (this.props.data.me) {
      var textColor = {color: 'white'}
      var progressColor = {backgroundColor: 'white'};
      var cardColor = Styles[this.props.activity + 'Bkgd'];
    }
    else {
      var textColor = {color: '#666'}
      var progressColor = Styles[this.props.activity + 'Bkgd'];
      var cardColor = {};
    }

    return (
    <View style={[Styles.userCard, cardColor]}>
      <View style={Styles.rankView}>
        <Text style={[Styles.rank, textColor]}>{this.props.data.rank}</Text>
      </View>
      <View style={Styles.infoView}>
        <View style={Styles.userInfo}>
          <Text style={[Styles.info, textColor]}><B>{this.props.data.name}</B> • {this.props.data.location}</Text>
          <Text style={[Styles.info, textColor]}><B>{Math.round(this.props.data.distance * 0.000621371)} mi</B></Text>
        </View>
        <View style={Styles.progressView}>
          <View style={[Styles.progress, {flex: this.props.data.progress}, progressColor]}/>
          <View style={{flex: (1-this.props.data.progress)}}/>
        </View>
      </View>
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
    return headers[time];
  }
  headerTime(time) {
    const headers = {
      "day" : "Today's",
      "week" : "This Week's",
      "month" : "This Month's"
    };
    return headers[time];
  }
  constructor(props) {
    super(props);
    var userID = props.data.userID;
    var activity = props.data.activity;
    var period = props.data.period;

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
          ranking = this.state.stats.friendRank + "th"
          break;
      }
      var friends = "friends";
      if (this.state.stats.friendTotal == 1) {
        friends = "friend";
      }
      var activity = this.props.data.activity;
      return (
        <View style={Styles.container}>
          <ScrollView style={localStyles.scrollView}>
            <Text style={[localStyles.heading, Styles[activity]]}>
              {this.headerTime(this.props.data.period)} {this.header(activity)} Leaderboard
            </Text>
            <Text style={localStyles.caption}>
              {heading}You ranked {ranking} out of your {this.state.stats.friendTotal} {friends}{ribbonOnTrack}.
              Your {this.state.stats.friendTotal} {friends} {this.pastTense(activity)} a total of {Math.round(this.state.stats.totalDistance * 0.000621371)} miles {this.periodMap(this.props.data.period)}.
              That's an average of {Math.round(this.state.stats.averageDistance * 0.000621371)} miles per person so far.
            </Text>
            { this.state.friends.map(function(user) {
              return <UserCard data={user} key={user.rank} activity={activity}></UserCard>;
            }) }
          </ScrollView>
        </View>
      );
    }

  }
}

var localStyles = StyleSheet.create({
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
    fontFamily: 'alegreyasans'
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
