### Note for implementing Neura

You need to create a login button in the app that will call the Neura.logIn JS function. The JS function should trigger the UI which will prompt the user to login. After the login is completed, there will be a JS callback that will tell you the Neura Access token. Send this to the server using the updateProfile function with the "neuraToken" param. 


## TODO
  - iOS Migration: configure React Native Facebook SDK for iOS
  - Connect with FB prior to Moves
  - Handle case when user revokes Facebook permissions and then tries to connect
    to moves
  - Acquire image license
  - Call update profile on every launch#TODO
  - Refactor backend
  - Write unit tests
