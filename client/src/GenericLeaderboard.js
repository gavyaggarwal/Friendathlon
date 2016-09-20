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
        <Text style={Styles.cardBodyText}>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyText}>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text style={Styles.cardBodyText}>
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
