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
} from 'react-native';
import {
  Router,
  Scene,
} from 'react-native-router-flux';

// Components
import Login from './components/Login';
import Chat from './components/Chat';
import NewChat from './components/NewChat';

import { Storage, Fcm } from "./services";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
console.disableYellowBox = true;

Storage.init();
Fcm.saveTokenDevice();

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
