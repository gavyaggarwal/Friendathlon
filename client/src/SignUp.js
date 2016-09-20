import React, { Component } from 'react';
import {
  Text,
  Image,
  TouchableHighlight,
  View,
  Animated,
  Alert,
  AsyncStorage,
  Linking
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

import Styles from './Styles';

//import FBIcon from 'react-native-vector-icons/FontAwesome';
//import { createIconSet } from 'react-native-vector-icons';
//const glyphMap = { 'moves': "@", };
//const MovesIcon = createIconSet(glyphMap, 'icomoon', './../android/app/src/main/assets/fonts/moves.ttf');
// const AnimatedIcon = Animated.createAnimatedComponent(Icon)

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
          console.log('Login cancelled');
        } else {

          AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    token = data.accessToken.toString()

                    const responseCallback = ((error, result) => {
                              if (error) {
                                console.log('error')
                              }
                              else {
                                try {
                                  AsyncStorage.setItem("FBID", (result.id).toString());
                                }
                                catch (error) {
                                  console.log(error)
                                }

                                var friends = [];
                                for (var i = 0; i < result.friends.data.length; i++) {
                                  friends.push((result.friends.data[i].id).toString())
                                };

                                fetch('http://www.friendathlon.com/updateProfile', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    "id" : result.id,
                                    "friends" : friends,
                                    "name" : result.name,
                                    "location" : result.location.name
                                  }),
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                  }
                                })
                                .then((response) => response.json())
                                .catch((error) => { console.log(error) });
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
        console.log('Login fail with error: ' + error);
      }
    );
  }

  async connectWithMoves() {
    try {
      var FBID = await AsyncStorage.getItem('FBID');
      if (FBID !== null){
        const url = 'moves://app/authorize?client_id=w13CA903PnotFEqh8qGVhFAS_nRoSM22&redirect_uri=http://www.friendathlon.com/auth&scope=activity&state=' + FBID;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
            Linking.openURL("https://play.google.com/store/apps/details?id=com.protogeo.moves").catch(err => console.error('An error occurred', err));
          }
          else {
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
          }
        }).catch(err => console.error('An error occurred dfsd', err));;
      } else {
        Alert.alert(
          'Warning',
          'Please login to Facebook before connecting to Moves.',
          [
            {text: 'OK'},
          ]
        )
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={{flex:3, alignItems: 'center', flexDirection: 'row'}}>
          <Text style={Styles.welcome}>
            Thanks for downloading {"\n"} our app!
          </Text>
        </View>
        <View style={Styles.connect}>
          <Text style={Styles.instructions}>
            Let''s start by finding your friends:
          </Text>
          <TouchableHighlight style={[Styles.btn, {backgroundColor:"#3b5998"}]} onPress={this.loginWithFacebook}>
            <View style={Styles.btnView}>
              <Image source = {require('./../img/facebook.png')} style={Styles.btnIcon}/>
              <Text style={Styles.btnText}>
                Login with Facebook
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={Styles.connect}>
          <Text style={Styles.instructions}>
            And getting your Moves:
          </Text>
          <TouchableHighlight style={[Styles.btn, {backgroundColor:"#00d45a"}]} onPress={this.connectWithMoves}>
            <View style={Styles.btnView}>
              <Image source = {require('./../img/moves.png')} style={Styles.btnIcon}/>
              <Text style={Styles.btnText}>
                Connect with Moves
              </Text>
            </View>
          </TouchableHighlight>
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
