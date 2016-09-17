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
    flexDirection: 'column',
  },
  welcome: {
    fontSize: 30,
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
    marginBottom: 15,
    fontSize: 20,
    fontFamily: 'alegreyasans_light',
  },
  loginButton: {
    flex:2,
    alignItems: 'center',
  },
  toolbar:{
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 50,
    color:'#000',
    textAlign:'center',
    fontFamily: 'alegreyasans_light',
  },
  toolbarTitle:{
    color:'#000',
    textAlign:'center',
    fontWeight:'bold',
    flex:1,
    fontFamily: 'alegreyasans_light',
    fontSize: 25,
  },
  card: {
    width: 200,
    flex:1,
    borderColor: '#000',
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  cardHead: {
    flex:1,
    backgroundColor: 'blue',
  },
  cardBody: {
    flex:1,
  }
});
