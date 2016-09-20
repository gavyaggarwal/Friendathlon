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
    </View>
  )}
}

export default class SpecificLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Today's Walking Leaderboard",
      caption: "Good job! You ranked 3rd out of your 19 friends, and you're on track for a ribbon. You also ranked in the top 5 percentile worldwide. Your 19 friends walked a total of 38.1 miles today. That's an average of 2 miles per person so far.",
      cards: [1, 3]
    };

  }
  render() {
    return (
      <View style={Styles.container}>
        <ScrollView style={localStyles.scrollView}>
          <Text style={localStyles.heading}>{this.state.title}</Text>
          <Text style={localStyles.caption}>{this.state.caption}</Text>
          { this.state.cards.map(function(user) {
            return <UserCard data={user}></UserCard>;
          }) }
        </ScrollView>
      </View>
    );
  }
}

var localStyles = StyleSheet.create({
  userCard: {
    backgroundColor: 'green',
    height: 20
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
