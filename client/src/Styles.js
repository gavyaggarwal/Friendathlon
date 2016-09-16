import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var exports = module.exports = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3E9',
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    fontFamily: 'alegreyasans',
  },
  button: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 20,
    fontFamily: 'alegreyasans_light',
  },
  connectBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
