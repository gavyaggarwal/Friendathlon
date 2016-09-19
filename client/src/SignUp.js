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
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
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
var token = '';

export default class SignUp extends Component {
  constructor(props) {

    super(props);

    let that = this;

    this.onPressButton = function() {
        that.props.navigator.push({id: "specific"});
    };
  }

  loginWithFacebook() {
    LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'user_location']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {

          AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    token = data.accessToken.toString()

                    const responseCallback = ((error, result) => {
                              if (error) {
                                alert('error')
                              }
                              else {
                                alert(JSON.stringify({
                                  "id" : result.id,
                                  "friends" : result.friends.data,
                                  "name" : result.name,
                                  "location" : result.location.name
                                }))
                                fetch('http://www.friendathlon.com/updateProfile', {
                                  method: 'POST',
                                  body:
                                  JSON.stringify({
                                    "id" : result.id,
                                    "friends" : result.friends.data,
                                    "name" : result.name,
                                    "location" : result.location.name
                                  })
                                })
                                .then((response) => response.json())
                                .catch((error) => { alert(error) });
                              }
                    })

                    // the famous params object...
                    const profileRequestParams = {
                                fields: {
                                    string: 'id, name, friends, location'
                                }
                    }

                    const profileRequestConfig = {
                                httpMethod: 'GET',
                                version: 'v2.5',
                                parameters: profileRequestParams,
                                accessToken: token
                    }

                    const profileRequest = new GraphRequest(
                                '/me',
                                profileRequestConfig,
                                responseCallback,
                    )

                    // Start the graph request.
                    new GraphRequestManager().addRequest(profileRequest).start();
                  }
                )
        }
      },
      function(error) {
        alert('Login fail with error: ' + error);
      }
    );
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
