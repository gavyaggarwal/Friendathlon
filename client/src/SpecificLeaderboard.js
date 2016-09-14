import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Styles from './Styles';

export default class SpecificLeaderboard extends Component {
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.welcome}>
          Specific Leaderboard will go here
        </Text>
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text style={Styles.button}>Back</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
