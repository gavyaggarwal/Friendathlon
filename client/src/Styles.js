import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

module.exports = StyleSheet.create({
  container: {
    flex: 1,
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 15,
    fontSize: 20,
    fontFamily: 'alegreyasans_light',
  },
  connect: {
    flex:2,
    alignItems: 'center',
  },
  toolbar:{
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarButtonRight:{
    width: 25,
    height: 25,
    justifyContent: 'flex-end',
    tintColor: '#666',
    position: 'absolute',
    top: 15,
    right: 7
  },
  toolbarButtonLeft:{
    width: 35,
    height: 35,
    justifyContent: 'flex-end',
    tintColor: '#666',
    position: 'absolute',
    top: 10
  },
  toolbarTitle:{
    color: '#666',
    fontWeight:'bold',
    fontFamily: 'alegreyasans_regular',
    fontSize: 25,
    //justifyContent: 'center',
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
    alignItems: 'center',
  },
  cardHeadText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'alegreyasans_bold',
    marginBottom: 10
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
  cardIcon: {
    tintColor: 'white',
    height: 80,
    width: 80,
    marginTop: 10
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
  },
  btn: {
    width: 250,
    height: 60,
    borderRadius: 40,
  },
  btnView: {
    width: 250,
    height: 60,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
    tintColor: 'white'
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontFamily: 'alegreyasans_bold',
  },
  userCard: {
    marginTop: 6,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 6,
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    alignItems: 'center'
  },
  rank: {
    fontFamily: 'opensans_bold',
    fontSize: 35,
    marginRight: 5,
    marginLeft: 5
  },
  rankView: {
    alignItems: 'center',
    width: 50,
  },
  info: {
    fontFamily: 'alegreyasans_regular',
    fontSize: 13,
  },
  infoView: {
    flex:1,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center'
  },
  progress: {
    height: 10,
    backgroundColor: '#666',
    borderRadius: 5
  },
  progressView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  }
});
