import React, { Component } from 'react';
import {
  AsyncStorage
} from 'react-native';

var PushNotification = require('react-native-push-notification');

module.exports = {
  register: function() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function(token) {
        console.log( 'Recieved Token:', JSON.stringify(token) );
        try {
          const userID = await AsyncStorage.getItem('FBID');
          if (value !== null) {
            fetch('http://www.friendathlon.com/updateProfile', {
              method: 'POST',
              body:
                JSON.stringify({
                  "id" : userID,
                  "notificationToken" : token
                })
            });
          }
        } catch (error) {
          // Error retrieving data
        }
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          console.log( 'Recieved Notification:', JSON.stringify(notification) );
          if (notification.notification == undefined) {
            return;
          }
          var data = JSON.parse(notification.notification);
          if (data == undefined || data.message == undefined) {
            return;
          }
          PushNotification.localNotification({
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            //title: data.subject, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message: data.message // (required)
        });
      },
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "172550997828",
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }
}
