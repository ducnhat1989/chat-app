import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList
} from 'react-native';
import ActionCable from 'react-native-actioncable';
import axios from 'axios';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: '',
      chatLogs: [],
      isRefresh: false,
      currentPage: 1,
      onPoint: "bottom",
    };
  }

  componentWillMount() {
    this.createSocket();
  }

  componentDidMount() {
    this.fetch_chat_logs(1, "bottom");
  }

  componentDidUpdate() {
    setTimeout(
      () => this.autoScroll(), 400
    )
  }

  render() {
    return (
      <View style={styles.container_chat}>
        <View style={styles.header}><Text>Chat</Text></View>
        <View style={styles.log_chats}>
          <FlatList
            ref="log_chats"

            refreshing={this.state.isRefresh}
            onRefresh={ () => {this.refreshTop()} }

            onEndReachedThreshold={0.2}
            onEndReached={ () => this.refreshBottom() }

            data={this.state.chatLogs}
            renderItem={ ({item}) => (
              <View style={styles.chat_item}>
                <View style={styles.chat_name}>
                  <Text>{item.user_name}</Text>
                </View>
                <View style={styles.chat_content}>
                  <Text>{item.content}</Text>
                </View>
                <View style={styles.chat_time}>
                  <Text>{item.created_at}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.form_chat}>
          <View>
            <TextInput
              onChangeText={ (text) => this.updateCurrentChatMessage(text) }
              style={styles.input_text}
              placeholder="Enter your message..."
              value={this.state.currentChatMessage}
            />
          </View>

          <View>
            <Button
              onPress={ () => this.handleSendMessage() }
              title="Send"
            />
          </View>
        </View>
      </View>
    );
  }

  // My functions

  refreshTop() {
    this.state.isRefresh = true;
    this.setState(this.state);
    this.fetch_chat_logs(this.state.currentPage + 1, "top");
  }

  refreshBottom() {
    this.state.isRefresh = true;
    this.setState(this.state);
    this.fetch_chat_logs(this.state.currentPage - 1, "top");
  }

  autoScroll() {
    switch(this.state.onPoint){
      case "top":
        this.refs.log_chats.scrollToOffset({offset: 1});
        break;
      case "bottom":
        this.refs.log_chats.scrollToEnd();
        break;
      default:
        break;
    }
  }

  updateCurrentChatMessage(text) {
    this.state.currentChatMessage = text;
    this.setState(this.state);
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
        received: (data) => {
          let chatLogs = this.state.chatLogs.slice(-19);
          chatLogs.push(data);
          this.state.chatLogs = chatLogs;
          this.state.currentChatMessage = '';
          this.state.onPoint = "bottom";
          this.setState(this.state);
        },
        create: function(chatContent){
          this.perform('create', {
            content: chatContent
          });
        }
      }
    )
  }

  handleSendMessage() {
    this.chats.create(this.state.currentChatMessage);
    this.state.currentChatMessage = '';
    this.setState(this.state);
  }

  fetch_chat_logs(page, onPoint) {
    if(page <= 0){
      this.state.isRefresh = false;
      this.setState(this.state);
      return true;
    }

    axios.get(`http://10.0.2.2:3001/api/v1/chat_logs?currentPage=${page}`)
      .then(res => {
        this.state.chatLogs = res.data.chat_logs;
        this.state.currentPage = parseInt(res.data.currentPage);
        this.state.isRefresh = false;
        this.state.onPoint = onPoint;
        this.setState(this.state);
      })
      .catch(err => {
        this.state.isRefresh = false;
        this.state.onPoint = onPoint;
        this.setState(this.state);
        alert(err);
      });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container_chat: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flex: 1,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  log_chats: {
    flex: 15,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  chat_item: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  chat_name: {
    flex: 4,
    paddingRight: 5,
  },
  chat_content: {
    flex: 20,
  },
  chat_time: {
    flex: 4,
    paddingLeft: 5,
  },
  form_chat: {
    flex: 4,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});