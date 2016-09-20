import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Navigator,
  Text,
  View
} from 'react-native';

import SignUp from './src/SignUp';
import GenericLeaderboard from './src/GenericLeaderboard';
import SpecificLeaderboard from './src/SpecificLeaderboard';
import Notifications from './src/Notifications';

class Friendathlon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      needsLogin: false
    };
    var that = this;
    (async function() {
      try {
        const userID = await AsyncStorage.getItem('FBID');
        if (userID !== null) {
          let response = await fetch('http://www.friendathlon.com/getProfile?id' + userID);
          let responseJson = await response.json();
          if (responseJson.validUser) {
            that.setState({
              userID: userID,
              needsLogin: false
            });
          } else {
            throw {message: "Logged Out"};
          }
        } else {
          throw {message: "Logged Out"};
        }
      } catch (error) {
        that.setState({
          userID: null,
          needsLogin: true
        });
      }
    })();
  }
  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'signup':
        return (<SignUp navigator={navigator} />);
      case 'generic':
        return (<GenericLeaderboard userID={this.state.userID} navigator={navigator} />);
      case 'specific':
        return (<SpecificLeaderboard userID={this.state.userID} navigator={navigator} />);
    }
  }
  render() {
    return (<SpecificLeaderboard userID= {this.state.userID} navigator={navigator} />);
    if (this.state.needsLogin) {
      return (<SignUp />);
    } else if (this.state.userID == null) {
      return (
        <Text>Loading</Text>
      );
    } else {
      return (
        <Navigator initialRoute={{id: 'specific'}} renderScene={this.navigatorRenderScene}/>
      );
    }
  }
}

Notifications.register();

AppRegistry.registerComponent('Friendathlon', () => Friendathlon);
