import { Component, OnInit } from '@angular/core';
import {UtilsService} from '../utils.service';
import {MyAdapter} from './chat.adaper';
import {AuthorizationService} from '../AuthorizationService';
import {ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatParticipant, Message, ParticipantResponse} from 'ng-chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  loaded = false

  socketAddress = 'ws://localhost:8095/publish-message'

  message = ''

  broadcastId = 1

  ws: WebSocket

  userId = +localStorage.getItem('userId');

  public adapter: MyAdapter;
 
  activeUsers = []

  convertedActiveUsersList = []

  messages = {1: [{'FromUsername': 'Ruslan', 'Time': new Date(), 'Text': 'Here we are!'}]};

  constructor(public utilsService: UtilsService, private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.initWebSocket();
  }
  initWebSocket() {
    this.ws = new WebSocket(this.socketAddress);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({'ConnectedUserId': +localStorage.getItem('userId')}));
    };
    this.ws.onmessage = (event) => {
      const currentMessage = JSON.parse(event.data);
      if (currentMessage['activeUsers']) {
        this.setUpActiveUsers(currentMessage);
        this.openActiveUserChats(currentMessage['Username']);
      } else if (currentMessage['NewActiveUserId']) {
        this.addActiveUser(currentMessage);
      } else if (currentMessage['DisconnectedUserId']) {
        this.removeUser(currentMessage['DisconnectedUserId']);
      } else {
        if(currentMessage['To'] != this.broadcastId) {
          this.receivePrivateMessage(currentMessage)
        } else {
          this.receiveBroadcastMessage(currentMessage, event);
        }        
      }
    };
  }

  openActiveUserChats(username) {
    this.activeUsers.forEach(it => {
      if(document.querySelectorAll('[title="' + username + '"]').length < 2) {
        (document.querySelectorAll('[title="' + username + '"]')[0]  as HTMLElement).click();
      }
    });
  }

  receivePrivateMessage(currentMessage) {  
    const privateMessage = new Message();
    privateMessage.fromId = currentMessage['From'];
    privateMessage.toId = currentMessage['To'];
    privateMessage.message = currentMessage['Text'];
    privateMessage.dateSent = new Date(currentMessage['Time']);
    this.adapter.messages.push(privateMessage);
  }

  receiveBroadcastMessage(currentMessage, event) {
    if (!this.messages[currentMessage['To']]) {
      this.messages[currentMessage['To']] = [];
    }
    this.messages[currentMessage['To']].push(JSON.parse(event.data));
  }

  removeUser(userId) {
    this.convertedActiveUsersList.forEach((it, indx) => {
      if(it.id == userId) {
        this.convertedActiveUsersList.splice(indx, 1);
      }
    });
  }

  addActiveUser(message) {
    this.convertedActiveUsersList.push(
      {
        participantType: ChatParticipantType.User,
        id: message['NewActiveUserId'],
        displayName: message['NewActiveUserName'],
        avatar: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj',
        status: ChatParticipantStatus.Online
        }
    );
    //this.activeUsers.push(activeUserId);
  }

  setUpActiveUsers(currentMessage) {
    this.convertedActiveUsersList = currentMessage['activeUsers'].filter(it => it.Id != +localStorage.getItem('userId'))
                .map(it => {          
          return {
          participantType: ChatParticipantType.User,
          id: it.Id,
          displayName: it.Username,
          avatar: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj',
          status: ChatParticipantStatus.Online
          }
        });
        this.adapter = new MyAdapter(this.ws, this.convertedActiveUsersList);
        this.activeUsers = currentMessage['activeUsers'];
        this.loaded = true;
  }

  sendCommonMessage() {
    this.ws.send(JSON.stringify({'token': localStorage.getItem(AuthorizationService.authTokenKey), 'from': +localStorage.getItem('userId'), 'to': this.broadcastId, 'text': this.message, 'time': new Date().getTime()}));
  }
}
