import React, { Component } from 'react';
import {
  Text,
  Image,
  TouchableHighlight,
  View,
  Animated,
  Alert,
  AsyncStorage,
  Linking,
  NativeModules
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

import Styles from './Styles';
var neura = NativeModules.Neura;

// import FBIcon from 'react-native-vector-icons/FontAwesome';
// import { createIconSet } from 'react-native-vector-icons';
// const glyphMap = { 'moves': "@", };
// const MovesIcon = createIconSet(glyphMap, 'icomoon', './../android/app/src/main/assets/fonts/moves.ttf');
// const AnimatedIcon = Animated.createAnimatedComponent(Icon)

var token = '';

export default class SignUp extends Component {
  checkCompletion() {
    if (this.state.facebookDone && this.state.movesDone && this.state.neuraDone) {
      this.props.signUpComplete(this.state.userID);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      facebookDone: false,
      movesDone: false,
      neuraDone: false
    };

    var that = this;

    this.loginWithFacebook = function() {
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
                                      "location" : (result.location && result.location.name) ? result.location.name : "No Location"
                                    }),
                                    headers: {
                                      'Accept': 'application/json',
                                      'Content-Type': 'application/json',
                                    }
                                  })
                                  .then((response) => {
                                    that.setState({
                                      userID: result.id,
                                      facebookDone: true
                                    });
                                    that.checkCompletion();
                                  })
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
    };

    this.connectWithMoves = function() {
      if (that.state.facebookDone) {
        const url = 'moves://app/authorize?client_id=w13CA903PnotFEqh8qGVhFAS_nRoSM22&redirect_uri=http://www.friendathlon.com/auth&scope=activity&state=' + that.state.userID;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
            Linking.openURL("https://play.google.com/store/apps/details?id=com.protogeo.moves").catch(err => console.error('An error occurred', err));
          }
          else {
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
            that.waitForMoves();
          }
        }).catch(err => console.error('An error occurred', err));;
      } else {
        Alert.alert(
          'Warning',
          'Please login to Facebook before connecting to Moves.',
          [
            {text: 'OK'},
          ]
        )
      }
    };

    this.waitForMoves = function() {
      var timer = setInterval(async function() {
        let response = await fetch('http://www.friendathlon.com/getProfile?id=' + that.state.userID);
        let responseJson = await response.json();
        if (responseJson.validUser) {
          clearInterval(timer);
          that.setState({
            movesDone: true
          });
          that.checkCompletion();
        }
      }, 1500);
    };

    this.connectWithNeura = function() {
      if (that.state.facebookDone) {
        var events = ["userWokeUp", "userIsIdle", "userArrivedHome", "userStartedRunning"];
        neura.logIn(events, function(neuraID, accessToken) {
          console.log("We were successfully able to log into neura.");
          console.log("Neura User ID:", neuraID);
          console.log("Neura Access Token:", accessToken);

          fetch('http://www.friendathlon.com/updateProfile', {
            method: 'POST',
            body: JSON.stringify({
              "id" : that.state.userID,
              "neuraID" : neuraID
            }),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });

          for (var i = 0; i < events.length; i++) {
            var event = events[i];
            neura.subscribe(event);
          }

          that.setState({
            neuraDone: true
          });
          that.checkCompletion();

        }, function(error) {
          console.log("There was an error logging into neura.");
          console.log("The error is:", error);
        });
      } else {
        Alert.alert(
          'Warning',
          'Please login to Facebook before connecting to Neura.',
          [
            {text: 'OK'},
          ]
        );
      }
    };

    this.skipNeura = function() {
      that.setState({
        neuraDone: true
      });
      that.checkCompletion();
    };
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={{flex: 4, alignItems: 'center', flexDirection: 'column'}}>
          <Image source={require('./../img/logo.png')} style={{height:100, width: 100, marginTop: 30}}/>
          <Text style={Styles.welcome}>
            Thanks for downloading {"\n"} Friendathlon!
          </Text>
        </View>
        <View style={Styles.connect}>
          <Text style={Styles.instructions}>
            Let's start by finding your friends:
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
            And if you'd like, enable contextual notifications:
          </Text>
          <TouchableHighlight style={[Styles.btn, {backgroundColor:"#00ccff"}]} onPress={this.connectWithNeura}>
            <View style={Styles.btnView}>
              <Image source = {require('./../img/neura.png')} style={Styles.btnIcon}/>
              <Text style={Styles.btnText}>
                Connect with Neura
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
        <View style={{flex:1, alignItems: 'center', marginTop:20}}>
          <Text style={Styles.instructions}>
            And you'll be set to compete with your friends!
          </Text>
        </View>
      </View>
    );
  }
}
