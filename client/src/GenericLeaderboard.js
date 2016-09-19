import React, { Component } from 'react';
import {
  Text,
  Image,
  TouchableHighlight,
  ScrollView,
  View
} from 'react-native';

import Styles from './Styles';

class ActivityCard extends Component {
  render () {
    return (
    <View style={Styles.card}>
      <View style={Styles.cardHead}>
        <Image
          source={require('../../mocks/movesLogo.png')}
        />
        <Text style={Styles.cardHeadText}>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text>
          {this.props.activity}
        </Text>
      </View>
      <View style={Styles.cardBody}>
        <Text>
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
    return (
      <View>
        <View style={Styles.toolbar}>
          <Text style={Styles.toolbarTitle}>Friendathlon Leaderboards</Text>
          <Text style={Styles.toolbarButton}></Text>
        </View>
        <View style={{flex:1}}>
          <ScrollView horizontal style={{flex:1}}>
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
