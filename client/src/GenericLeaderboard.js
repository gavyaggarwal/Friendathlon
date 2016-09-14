import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Styles from './Styles';

export default class GenericLeaderboard extends Component {
  constructor(props) {

    super(props);

    this.state = {
      text: "Loading"
    };

    let that = this;

    this.onPressButton = function() {
        that.props.navigator.push({id: "specific"});
      };

    (async function() {
    try {
      let response = await fetch('http://google.com');
      that.setState({ text: "Done" });
    } catch(error) {
      that.setState({ text: "Error" });
      console.error(error);
    }
    })();
  }
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.welcome}>
          Welcome to React Native!
        </Text>
        <TouchableHighlight onPress={this.onPressButton}>
          <Text style={Styles.button}>Click Me</Text>
        </TouchableHighlight>
        <Text style={Styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
        <Text style={Styles.instructions}>
          Making a test HTTP request. Result: {this.state.text}
        </Text>
      </View>
    );
  }
}
