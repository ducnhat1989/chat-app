import React, {Component} from 'react';
import {
  AsyncStorage
} from 'react-native';
import {
  GiftedChat
} from 'react-native-gifted-chat';
import ActionCable from 'react-native-actioncable';
import {Actions} from "react-native-router-flux";
import axios from 'axios';

export default class NewChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      user: '',
      uid: '',
      client: '',
      access_token: '',
      refreshing: true,
      nextPage: 0
    };
  }

  componentWillMount() {
    storage.load({key: 'auth'})
      .then(res => {
        this.setState({
          user: res.user,
          uid: res.uid,
          client: res.client,
          access_token: res.access_token
        })
      })
      .catch(err => {
        alert(err.message);
      });
    this.initMessages();
  }

  componentDidMount() {
    this.createSocket();
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.user.id,
        }}

        loadEarlier={this.state.refreshing}

        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: ({ nativeEvent }) => {
            if (this.isCloseToTop(nativeEvent)) {
              this.setState({refreshing: true});
              this.loadMoreMessage();
            }
          }
        }}
      />
    );
  }

  // Scene function
  static onRight() {
    // storage.load({key: 'auth'})
    //   .then(res => {
    //     this.setState({
    //       user: res.user,
    //       uid: res.uid,
    //       client: res.client,
    //       access_token: res.access_token
    //     })
    //   })
    //   .catch(err => {
    //     alert(err.message);
    //   });
    // axios.delete(`http://10.0.2.2:3001/auth/logout`,
    //   {
    //     headers: {
    //       uid: this.state.uid,
    //       client: this.state.client,
    //       'access-token': this.state.access_token
    //     }
    //   })
    //   .then(res => {
    //     console.error(JSON.stringify(res));
    //     // storage.remove({key: 'auth'});
    //     // this.redirect_to_login();
    //   })
    //   .catch(err => {
    //     alert(err);
    //   });

    Actions.login({
      title: 'Login',
    });
  }

  // My function
  fetchMessages(limit, nextPage) {
    axios.get(`http://10.0.2.2:3001/api/v1/chat_messages?limit=${limit}&nextPage=${nextPage}`)
      .then(res => {
        data_messages = res.data.chat_messages;
        this.setState(prevState => ({
          messages: GiftedChat.prepend(prevState.messages, data_messages),
          nextPage: res.data.nextPage,
          refreshing: false,
        }));
      })
      .catch(err => {
        alert(err);
      });
  }

  initMessages() {
    this.fetchMessages(20, this.state.nextPage);
  }

  loadMoreMessage() {
    nextPage = this.state.nextPage + 1;
    this.fetchMessages(20, nextPage);
  }

  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  logout(){
    axios.delete(`http://10.0.2.2:3001/auth/logout`,
      {
        headers: {
          uid: this.state.uid,
          client: this.state.client,
          'access-token': this.state.access_token
        }
      })
      .then(res => {
        storage.remove({key: 'auth'});
        this.redirect_to_login();
      })
      .catch(err => {
        alert(err);
      });

    Actions.login({
      title: 'Login',
    });
  }

  redirect_to_login() {
    Actions.login({title: 'Login'});
  }

  createSocket() {
    let cable = ActionCable.createConsumer('ws://10.0.2.2:3001/cable');

    this.chats = cable.subscriptions.create(
      {
        channel: 'ChatChannel'
      },
      {
        connected: () => {
          console.log('Connected!');
        },
        received: (messages) => {
          this.setState(prevState => ({
            messages: GiftedChat.append(prevState.messages, messages)
          }));
        },
        create: function(messages){
          this.perform('create', {content: messages});
        }
      }
    )
  }

  onSend(messages = []) {
    this.chats.create(messages);
  }
};