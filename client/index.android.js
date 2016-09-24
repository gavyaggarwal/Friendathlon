import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  BackAndroid,
  NativeModules,
  Navigator,
  Text,
  View
} from 'react-native';

var neura = NativeModules.Neura;

import SignUp from './src/SignUp';
import GenericLeaderboard from './src/GenericLeaderboard';
import SpecificLeaderboard from './src/SpecificLeaderboard';
import Notifications from './src/Notifications';

var navigator;

/*
var events = ["userLeftHome", "userLeftActiveZone", "userArrivedWorkFromHome", "userArrivedHome", "userArrivedHomeFromWork", "userArrivedToWork", "userArrivedAtGroceryStore", "userArrivedAtSchoolCampus", "userArrivedAtAirport", "userArrivedAtHospital", "userLeftAirport", "userArrivedAtClinic", "userArrivedAtRestaurant", "userLeftCafe", "userLeftHospital", "userArrivedAtCafe", "userLeftRestaurant", "userLeftSchoolCampus", "userArrivedAtPharmacy", "userLeftGym", "userArrivedAtActiveZone", "userArrivedToGym", "userLeftWork", "userStartedRunning", "userWokeUp", "userIsIdle", "userIsOnTheWayToActiveZone"];
neura.logIn(events, function(neuraID, accessToken) {
  console.log("We were successfully able to log into neura.");
  console.log("Neura User ID:", neuraID);
  console.log("Neura Access Token:", accessToken);
  // TODO: Notify server of this user id with GET /updateProfile
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    neura.subscribe(event);
  }
}, function(error) {
  console.log("There was an error logging into neura.");
  console.log("The error is:", error);
});
*/

/*
neura.logOut(function(success) {
  if (success) {
    console.log("Neura was logged out successfully.");
  } else {
    console.log("There was an error logging out neura");
  }
});
*/

BackAndroid.addEventListener('hardwareBackPress', function() {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
});

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
          let response = await fetch('http://www.friendathlon.com/getProfile?id=' + userID);
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
    this.signUpComplete = function(userID) {
      that.setState({
        userID: userID,
        needsLogin: false
      });
    }
  }
  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'signup':
        return (<SignUp data={route.data} navigator={navigator} />);
      case 'generic':
        return (<GenericLeaderboard data={route.data} navigator={navigator} />);
      case 'specific':
        return (<SpecificLeaderboard data={route.data} navigator={navigator} />);
    }
  }
  render() {
    if (this.state.needsLogin) {
      return (<SignUp signUpComplete={this.signUpComplete} />);
    } else if (this.state.userID == null) {
      return (
        <View style={{flex: 1, backgroundColor: '#F5F3E9'}}/>
      );
    } else {
      return (
        <Navigator ref={(nav) => { navigator = nav; }} initialRoute={{
            id: 'generic',
            data: {
              userID: this.state.userID
            }
          }} renderScene={this.navigatorRenderScene}/>
      );
    }
  }
}

Notifications.register();

AppRegistry.registerComponent('Friendathlon', () => Friendathlon);
