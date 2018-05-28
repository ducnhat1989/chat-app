import React, { Component } from 'react';
import logo from './logo.svg';
import Cable from 'actioncable';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: '',
      chatLogs: []
    };
  }

  componentWillMount() {
    this.fetch_chat_logs();
    this.createSocket();
  }

  render() {
    return (
      <div className='App'>
        <div className='stage'>
          <h1>Chat</h1>
          <ul className='chat-logs' id='chat-logs'>
            { this.renderChatLog() }
          </ul>

          <input
            value={ this.state.currentChatMessage }
            onChange={ (e) => this.updateCurrentChatMessage(e) }
            onKeyPress={ (e) => this.handleChatInputKeyPress(e) }
            type='text'
            placeholder='Enter your message...'
            className='chat-input' ref='chat-input' />

          <button
            onClick={ (e) => this.handleSendEvent(e) }
            className='send'
          >Send</button>
        </div>
      </div>
    );
  }

  // My functions

  updateCurrentChatMessage(event) {
    this.state.currentChatMessage = event.target.value;
    this.setState(this.state);
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = cable.subscriptions.create(
      {
        channel: 'ChatChannel'
      },
      {
        connected: () => {
          console.log('Connected!');
        },
        received: (data) => {
          let chatLogs = this.state.chatLogs;
          chatLogs.push(data);
          this.state.chatLogs = chatLogs;
          this.setState(this.state);
          this.scrollBottom("chat-logs");
        },
        create: function(chatContent){
          this.perform('create', {
            content: chatContent
          });
        }
      }
    )
  }

  scrollBottom(element) {
    var element_div = document.getElementById(element);
    element_div.scrollTop = element_div.scrollHeight;
  }

  renderChatLog() {
    return this.state.chatLogs.map( (el) => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{ el.content }</span>
          <span className='chat-created-at'>{ el.created_at }</span>
          <a href={`#chat_${el.id}`}></a>
        </li>
      );
    })
  }

  handleSendEvent(event) {
    event.preventDefault();
    this.chats.create(this.state.currentChatMessage);
    this.state.currentChatMessage = '';
    this.setState(this.state);
  }

  handleChatInputKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleSendEvent(event);
    }
  }

  fetch_chat_logs() {
    axios.get('http://localhost:3001/api/v1/chat_logs')
      .then(res => {
        this.state.chatLogs = res.data.chat_logs;
        this.setState(this.state);
        this.scrollBottom("chat-logs");
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export default App;
