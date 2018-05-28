/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import Storage from 'react-native-storage';
import {
  Router,
  Scene,
} from 'react-native-router-flux';

// Components
import Login from './components/Login';
import Chat from './components/Chat';
import NewChat from './components/NewChat';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var storage = new Storage({
  // maximum capacity, default 1000
  size: 1000,

  // Use AsyncStorage for RN, or window.localStorage for web.
  // If not set, data would be lost after reload.
  storageBackend: AsyncStorage,

  // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,

  // cache data in the memory. default is true.
  enableCache: true,

  // if data was not found in storage or expired,
  // the corresponding sync method will be invoked and return
  // the latest data.
  sync : {
    // we'll talk about the details later.
  }
});

global.storage = storage;

class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
};

export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key='root'>
          <Scene key='login' component={Login} title='Login' />
          <Scene
            key='chat'
            component={NewChat}
            title='ChatRoom'
            rightTitle="LogOut"
          />

        </Scene>
      </Router>
    );
  }
};
