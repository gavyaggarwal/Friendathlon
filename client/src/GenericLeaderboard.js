import React, { Component } from 'react';
import {
  Text,
  Image,
  ToolbarAndroid,
  TouchableHighlight,
  ScrollView,
  View,
  Dimensions
} from 'react-native';

import Styles from './Styles';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

class ActivityCard extends Component {
  pastTense(verb) {
    const pastTense = {
      "walking" : "walked",
      "running" : "ran",
      "cycling" : "cycled"
    };
    return pastTense[verb];
  }

  header(verb) {
    const headers = {
      "walking" : "Walking",
      "running" : "Running",
      "cycling" : "Cycling"
    };
    return headers[verb];
  }

  render () {
    activity = this.props.info.activity;
    info = this.props.info;
    switch(activity) {
      case "walking":
          path = require('./../img/walking.png');
          break;
      case "running":
          path = require('./../img/running.png');
          break;
      case "cycling":
          path = require('./../img/cycling.png');
          break;
      default:
          path = '';
    }

    return (
    <View style={[Styles.card, Styles[activity + 'Border']]}>
      <View style={[Styles.cardHead, Styles[activity + 'Bkgd']]}>
        <Image style={Styles.cardIcon} source={path}/>
        <Text style={Styles.cardHeadText}>
          {this.header(activity)}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          Daily
        </Text>
        <Text style={Styles.cardBodyText}>
        You {this.pastTense(activity)} <B>{info.daily.distance}</B> miles today. {"\n"}
        You rank <B>{info.daily.rank}</B> out of <B>{info.daily.total}</B>.
        </Text>
        <Text style={[Styles.cardBodyText, Styles[activity]]}>
        More Info
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          Weekly
        </Text>
        <Text style={Styles.cardBodyText}>
        You {this.pastTense(activity)} <B>{info.weekly.distance}</B> miles this week. {"\n"}
        You rank <B>{info.weekly.rank}</B> out of <B>{info.weekly.total}</B>.
        </Text>
        <Text style={[Styles.cardBodyText, Styles[activity]]}>
        More Info
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          Monthly
        </Text>
        <Text style={Styles.cardBodyText}>
        You {this.pastTense(activity)} <B>{info.monthly.distance}</B> miles this month. {"\n"}
        You rank <B>{info.monthly.rank}</B> out of <B>{info.monthly.total}</B>.
        </Text>
        <Text style={[Styles.cardBodyText, Styles[activity]]}>
        More Info
        </Text>
      </View>
    </View>
  )}
}

export default class GenericLeaderboard extends Component {
  constructor(props) {

    super(props);

    let that = this;

    this.onPressButton = function() {
        that.props.navigator.push({id: "specific"});
      };
    /*
    try {
      var FBID = await AsyncStorage.getItem('FBID');
      if (FBID !== null){
        fetch('http://www.friendathlon.com/genericLeaderboard?id=' + FBID)
        .then((response) => response.json())
        .then((responseJson) => { this.cards = responseJson.leaderboards })
        .catch((error) => { console.error(error); });
      }
    } catch (error) {
      console.log(error);
    }

    */
    var data = {
        leaderboards: [
          {
            activity: "walking",
            daily: {
              distance: 3.4,
              rank: 3,
              total: 5
            },
            weekly: {
              distance: 14,
              rank: 5,
              total: 19
            },
            monthly: {
              distance: 39,
              rank: 8,
              total: 24
            }
          },
          {
            activity: "running",
            daily: {
              distance: 0.5,
              rank: 4,
              total: 5
            },
            weekly: {
              distance: 0.5,
              rank: 12,
              total: 19
            },
            monthly: {
              distance: 4,
              rank: 12,
              total: 24
            }
          },
          {
            activity: "cycling",
            daily: {
              distance: 0.5,
              rank: 4,
              total: 5
            },
            weekly: {
              distance: 0.5,
              rank: 12,
              total: 19
            },
            monthly: {
              distance: 4,
              rank: 12,
              total: 24
            }
          }
        ]
      }
    this.cards = data['leaderboards'];
  }

  render() {
    let cards = this.cards.map((card, i) => {
        return <ActivityCard key = {  i } info = { card } >
               </ActivityCard>
    })

    return (
      <View style={Styles.container}>
        <View style={Styles.toolbar}>
          <Text style={Styles.toolbarTitle}>Friendathlon Leaderboards</Text>
        </View>
        <Image style={Styles.toolbarButtonRight} source={require('./../img/profile.png')}></Image>
        <View style={{flex:1}}>
          <ScrollView horizontal>
            { cards }
          </ScrollView>
        </View>
      </View>
    );
  }
}
