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
  metersToMiles(meters) {
    return (Math.round(meters * 0.000621371 * 10) / 10.0)
  }
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

    var activity = this.props.info.activity;
    var info = this.props.info;
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
        You {this.pastTense(activity)} <B>{this.metersToMiles(info.daily.distance)}</B> miles today. {"\n"}
        You rank <B>{info.daily.rank}</B> out of <B>{info.daily.total}</B>.
        </Text>
        <Text style={[Styles.cardBodyText, Styles[activity]]} period="day" activity={activity} onPress={this.props.buttonCallback}>
        More Info
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          Weekly
        </Text>
        <Text style={Styles.cardBodyText}>
        You {this.pastTense(activity)} <B>{this.metersToMiles(info.weekly.distance)}</B> miles this week. {"\n"}
        You rank <B>{info.weekly.rank}</B> out of <B>{info.weekly.total}</B>.
        </Text>
        <Text style={[Styles.cardBodyText, Styles[activity]]} period="week" activity={activity} onPress={this.props.buttonCallback}>
        More Info
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          Monthly
        </Text>
        <Text style={Styles.cardBodyText}>
        You {this.pastTense(activity)} <B>{this.metersToMiles(info.monthly.distance)}</B> miles this month. {"\n"}
        You rank <B>{info.monthly.rank}</B> out of <B>{info.monthly.total}</B>.
        </Text>
        <Text style={[Styles.cardBodyText, Styles[activity]]} period="month" activity={activity} onPress={this.props.buttonCallback}>
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
      that.props.navigator.push({
        id: "specific",
        data: {
          userID: that.props.data.userID,
          activity: this.activity,
          period: this.period
        }
      });
    };

    this.state = {
      leaderboards: []
    }

    var userID = this.props.data.userID;
    (async function() {
      try {
        let response = await fetch('http://www.friendathlon.com/genericLeaderboard?id=' + userID);
        let json = await response.json();
        that.setState(json);
      } catch(error) {
        console.error(error);
      }
    })();
  }

  render() {
    let cards = this.state.leaderboards.map((card, i) => {
        return <ActivityCard key={i} info={card} buttonCallback={this.onPressButton} />
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
