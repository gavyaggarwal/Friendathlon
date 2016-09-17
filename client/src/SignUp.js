import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  Animated,
  Alert
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

import Styles from './Styles';
import FBIcon from 'react-native-vector-icons/FontAwesome';

import { createIconSet } from 'react-native-vector-icons';
const glyphMap = { 'moves': "@", };
const MovesIcon = createIconSet(glyphMap, 'icomoon', 'C:/Users/Abirami/Documents/Friendathlon/client/android/app/src/main/assets/fonts/moves.ttf');
// C:\Users\Abirami\Documents\Friendathlon\client\android\app\src\main\assets\fonts
// const AnimatedIcon = Animated.createAnimatedComponent(Icon)

var CLIENT_ID = 12;
var CALLBACK_URI = 12;

export default class SignUp extends Component {
  constructor(props) {

    super(props);

    let that = this;

    this.onPressButton = function() {
        that.props.navigator.push({id: "specific"});
    };
  }

  loginWithFacebook() {

  }

  connectWithMoves() {

  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={{flex:3, alignItems: 'center', flexDirection: 'row'}}>
          <Text style={Styles.welcome}>
            Thanks for downloading {"\n"} our app!
          </Text>
        </View>
        <View style={Styles.loginButton}>
          <Text style={Styles.instructions}>
            Let''s start by finding your friends:
          </Text>
          <FBIcon.Button name="facebook" backgroundColor="#3b5998" onPress={this.loginWithFacebook}>
            Login with Facebook
          </FBIcon.Button>
        </View>
        <View style={Styles.loginButton}>
          <Text style={Styles.instructions}>
            And getting your Moves:
          </Text>
          <MovesIcon.Button name="moves" backgroundColor="#00d45a" onPress={this.loginWithFacebook}>
            Connect to Moves
          </MovesIcon.Button>
        </View>
        <View style={{flex:1, alignItems: 'center',}}>
          <Text style={Styles.instructions}>
            And you''ll be set to compete with your friends!
          </Text>
        </View>
      </View>
    );
  }
}
