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
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      title: "Today's Walking Leaderboard",
      caption: "Good job! You ranked 3rd out of your 19 friends, and you're on track for a ribbon. You also ranked in the top 5 percentile worldwide. Your 19 friends walked a total of 38.1 miles today. That's an average of 2 miles per person so far.",
      cards: [{
        rank: 1,
        name: "Gavy Aggarwal",
        location: "Newark, DE",
        distance: 5.7,
        progress: 1,
        me: false
      },
      {
        rank: 2,
        name: "Abirami Kurinchi-Vendhan",
        location: "Hillsboro, OR",
        distance: 4.9,
        progress: 0.85,
        me: false
      },
      {
        rank: 3,
        name: "John Doe",
        location: "Austin, TX",
        distance: 4.0,
        progress: 0.6,
        me: true
      }]
    };

  }
  render() {
    return (
      <View style={Styles.container}>
        <ScrollView style={localStyles.scrollView}>
          <Text style={localStyles.heading}>{this.state.title}</Text>
          <Text style={localStyles.caption}>{this.state.caption}</Text>
          { this.state.cards.map(function(user) {
            return <UserCard data={user} key={user.rank}></UserCard>;
          }) }
        </ScrollView>
      </View>
    );
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
