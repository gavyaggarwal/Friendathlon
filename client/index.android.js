import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  Text,
  View
} from 'react-native';

import SignUp from './src/SignUp';
import GenericLeaderboard from './src/GenericLeaderboard';
import SpecificLeaderboard from './src/SpecificLeaderboard';

class Friendathlon extends Component {
  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'signup':
        return (<SignUp navigator={navigator} />);
      case 'generic':
        return (<GenericLeaderboard navigator={navigator} />);
      case 'specific':
        return (<SpecificLeaderboard navigator={navigator} />);
    }
  }
  render() {
    return (
      <Navigator initialRoute={{id: 'generic'}} renderScene={this.navigatorRenderScene}/>
    );
  }
}

AppRegistry.registerComponent('Friendathlon', () => Friendathlon);
