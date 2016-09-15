/*
TODO: Update friends list on server each time app is started
*/

import React, { Component } from 'react';
import {
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

class Table extends Component {
  render() {
    if (this.props.items == undefined || this.props.items == []) {
      return (
        <Text>No items</Text>
      )
    } else {
      return (
        <Text>Items</Text>
      )
    }
  }
}

export default class SpecificLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  loggedIn(error, result) {
    console.log(error, result);
    alert("logged in");
  }
  loggedOut() {
    alert('logged out');
  }
  render() {
    return (
      <View style={Styles.container}>
        <LoginButton
          publishPermissions={["user_friends"]}
          onLoginFinished={this.loggedIn}
          onLogoutFinished={this.loggedOut} />
        <Text style={Styles.welcome}>
          Specific Leaderboard will go here
        </Text>
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text style={Styles.button}>Back</Text>
        </TouchableHighlight>
        <Table items={this.state.friends} />
      </View>
    );
  }
}
