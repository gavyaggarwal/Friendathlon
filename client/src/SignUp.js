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
  constructor(props) {
    super(props);

    this.state = {
      userID: null
    }
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
    var that = this;
    try {
      var FBID = await AsyncStorage.getItem('FBID');
      if (FBID !== null) {
        const url = 'moves://app/authorize?client_id=w13CA903PnotFEqh8qGVhFAS_nRoSM22&redirect_uri=http://www.friendathlon.com/auth&scope=activity&state=' + FBID;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
            Linking.openURL("https://play.google.com/store/apps/details?id=com.protogeo.moves").catch(err => console.error('An error occurred', err));
          }
          else {
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
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
    } catch (error) {
      console.log(error);
    }
  }

  async connectWithNeura(accepted) {
    var that = this;
    try {
      var FBID = await AsyncStorage.getItem('FBID');
      if (FBID !== null) {
        let response = await fetch('http://www.friendathlon.com/getProfile?id=' + FBID);
        let responseJson = await response.json();
        if (responseJson.movesConnected) {
          if(accepted) {
            var events = ["userLeftHome", "userLeftActiveZone", "userArrivedWorkFromHome", "userArrivedHome", "userArrivedHomeFromWork", "userArrivedToWork", "userArrivedAtGroceryStore", "userArrivedAtSchoolCampus", "userArrivedAtAirport", "userArrivedAtHospital", "userLeftAirport", "userArrivedAtClinic", "userArrivedAtRestaurant", "userLeftCafe", "userLeftHospital", "userArrivedAtCafe", "userLeftRestaurant", "userLeftSchoolCampus", "userArrivedAtPharmacy", "userLeftGym", "userArrivedAtActiveZone", "userArrivedToGym", "userLeftWork", "userStartedRunning", "userWokeUp", "userIsIdle", "userIsOnTheWayToActiveZone"];
            neura.logIn(events, function(neuraID, accessToken) {
              console.log("We were successfully able to log into neura.");
              console.log("Neura User ID:", neuraID);
              console.log("Neura Access Token:", accessToken);

              fetch('http://www.friendathlon.com/updateProfile', {
                method: 'POST',
                body: JSON.stringify({
                  "id" : FBID,
                  "neuraID" : neuraID
                }),
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
              })
              .then((response) => response.json())
              .catch((error) => { console.log(error) });

              // TODO: Notify server of this user id with GET /updateProfile
              for (var i = 0; i < events.length; i++) {
                var event = events[i];
                neura.subscribe(event);
              }
            }, function(error) {
              console.log("There was an error logging into neura.");
              console.log("The error is:", error);
            });
          } else {
            fetch('http://www.friendathlon.com/updateProfile', {
              method: 'POST',
              body: JSON.stringify({
                "id" : FBID,
                "neuraID" : ""
              }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            })
            .then((response) => response.json())
            .catch((error) => { console.log(error) });
          }
          var timer = setInterval(async function() {
            let response = await fetch('http://www.friendathlon.com/getProfile?id=' + FBID);
            let responseJson = await response.json();
            if (responseJson.validUser) {
              clearInterval(timer);
              console.log('right before the call');
              that.props.signUpComplete; // This is where I'm trying to change the state of the app, no variations of this work
            }
          }, 5000);
        } else {
          Alert.alert(
            'Warning',
            'Please login to Moves before connecting to Neura.',
            [
              {text: 'OK'},
            ]
          )
        }
      } else {
        Alert.alert(
          'Warning',
          'Please login to Facebook and Moves before connecting to Neura.',
          [
            {text: 'OK'},
          ]
        )
      }
    } catch (error) {
      alert(error);
    }

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
        <View style={Styles.connect}>
          <Text style={Styles.instructions}>
            And if you'd like, we'll send you timed notifications:
          </Text>
          <TouchableHighlight style={[Styles.btn, {backgroundColor:"#00ccff"}]} finishCallback={this.props.signUpComplete} onPress={()=>this.connectWithNeura(true)}>
            <View style={Styles.btnView}>
              <Image source = {require('./../img/neura.png')} style={Styles.btnIcon}/>
              <Text style={Styles.btnText}>
                Connect with Neura
              </Text>
            </View>
          </TouchableHighlight>
          <Text style={Styles.hyperlink} finishCallback={this.props.signUpComplete} onPress={()=>this.connectWithNeura(false)}>
            No thanks. I'll settle for untimed notifications.
          </Text>
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
