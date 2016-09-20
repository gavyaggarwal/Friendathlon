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
    color: '#666',
    textAlign:'center',
    fontWeight:'bold',
    flex:1,
    fontFamily: 'alegreyasans_regular',
    fontSize: 25,
  },
  card: {
    width: 230,
    flex:1,
    borderColor: 'blue',
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  cardHead: {
    backgroundColor: 'blue',
    borderTopRightRadius: 9,
    borderTopLeftRadius: 9,
  },
  cardHeadText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'alegreyasans_bold',
  },
  cardBody: {
    flex:1,
    justifyContent: 'center',
  },
  cardBodyTextHdr: {
    fontSize: 22,
    marginLeft: 10,
    fontFamily: 'alegreyasans_regular',
  },
  cardBodyText: {
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'alegreyasans_regular',
  },
  activityIcon: {
    tintColor: 'white',
  },
  walking: {
    color: '#00d55a'
  },
  walkingBkgd: {
    backgroundColor: '#00d55a',
  },
  walkingBorder: {
    borderColor: '#00d55a',
  },
  running: {
    color: '#f660f4'
  },
  runningBkgd: {
    backgroundColor: '#f660f4'
  },
  runningBorder: {
    borderColor: '#f660f4'
  },
  cycling: {
    color: '#00cdec'
  },
  cyclingBkgd: {
    backgroundColor: '#00cdec'
  },
  cyclingBorder: {
    borderColor: '#00cdec'
  }
});
