/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import GenericLeaderboard from './src/GenericLeaderboard';

class Friendathlon extends Component {
  render() {
    return (
      <GenericLeaderboard />
    );
  }
}

AppRegistry.registerComponent('Friendathlon', () => Friendathlon);
