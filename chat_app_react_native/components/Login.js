import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';

import { Fcm } from "../services";
import { IP_SERVER } from "../constants";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      isLogin: false,
      device: {}
    };
  }

  componentWillMount() {
    storage.load({
      key: 'device'
    }).then(ret => {
      this.setState({device: ret});
    })
  }

  render() {
    return (
      <View style={stylesLogin.container}>
        <View style={stylesLogin.topBox}>
          <Text style={stylesLogin.titleTopBox}>
            LOGIN FORM
          </Text>
        </View>

        <View style={stylesLogin.inputBox}>
          <TextInput
            onChangeText={ (text) => this.updateID(text) }
            placeholder='ID'
            value={this.state.id}
          />

          <TextInput
            onChangeText={ (text) => this.updatePass(text) }
            placeholder='Password'
            secureTextEntry={true}
            value={this.state.password}
          />

          <Button
            onPress={ () => this.authLogin() }
            title='Login'
          />
        </View>
      </View>
    );
  }

  // My function

  updateID(id) {
    this.setState({id: id});
  }

  updatePass(text) {
    this.setState({password: text});
  }

  authLogin() {
    axios.post(`http://${IP_SERVER}/auth/sign_in`, {
      email: this.state.id,
      password: this.state.password,
      device_type: this.state.device.type,
      device_token: this.state.device.token
      })
      .then(res => {
        this.setState({isLogin: true});
        this.sysnStorage(res);
        Fcm.resetBadge();
        this.redirect_to_chat();
      })
      .catch(err => {
        alert(err);
      });
  }

  redirect_to_chat() {
    Actions.chat({title: 'Chat Room'});
  }

  sysnStorage(res){
    storage.save({
      key: 'auth',
      data: {
        user: res.data.data,
        uid: res.headers.uid,
        client: res.headers.client,
        access_token: res.headers['access-token']
      },
      expires: 1000 * 60
    });
  }
};

const stylesLogin = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  topBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  titleTopBox: {

  },
  inputBox: {

  }
});