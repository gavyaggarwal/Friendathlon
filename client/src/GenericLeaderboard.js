import React, { Component } from 'react';
import {
  Text,
  Image,
  TouchableHighlight,
  ScrollView,
  View,
  Dimensions
} from 'react-native';

import Styles from './Styles';

class ActivityCard extends Component {
  render () {
    return (
    <View style={Styles.card}>
      <View style={Styles.cardHead}>
        <Text style={Styles.cardHeadText}>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyTextHdr}>
          {this.props.activity}
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
  }

  render() {
    var data = {
        leaderboards: [
          {
            activity: "walk",
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
            activity: "run",
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

    data = data['leaderboards'];

    var cards = [];

    return (
      <View style={Styles.container}>
        <View style={Styles.toolbar}>
          <Text style={Styles.toolbarTitle}>Friendathlon Leaderboards</Text>
          <Text style={Styles.toolbarButton}></Text>
        </View>
        <View style={{flex:1}}>
          <ScrollView horizontal>
            <ActivityCard activity='Walking'>
            </ActivityCard>
            <ActivityCard activity='Running'>
            </ActivityCard>
            <ActivityCard activity='Cycling'>
            </ActivityCard>
            <ActivityCard activity='Kayaking'>
            </ActivityCard>
          </ScrollView>
        </View>
      </View>
    );
  }
}
