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

  refresher = 1

  message = ''

  broadcastId = 1

  ws: WebSocket

  userId = +localStorage.getItem('userId');

  public adapter: MyAdapter;
  inited = false

  activeUsers = []

  messages = {};

  constructor(public utilsService: UtilsService, private authorizationService: AuthorizationService) { }

  ngOnInit() {
    setInterval(()=>{this.refresher++;}, 250);
    this.initWebSocket();
  }
  initWebSocket() {
    this.ws = new WebSocket('ws://localhost:8095/publish-message');

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({'ConnectedUserId': +localStorage.getItem('userId')}));
    };
    this.ws.onclose = () => {
      this.ws.send(JSON.stringify({'DisconnectedUserId': +localStorage.getItem('userId')}));
  };
    this.ws.onmessage = (event) => {
      const currentMessage = JSON.parse(event.data);
      if (currentMessage['activeUsers']) {
        const convertedUsersList = currentMessage['activeUsers'].filter(it => it.Id != +localStorage.getItem('userId'))
                .map(it => {          
          return {
          participantType: ChatParticipantType.User,
          id: it.Id,
          displayName: it.Username,
          avatar: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj',
          status: ChatParticipantStatus.Online
          }
        });
        this.adapter = new MyAdapter(this.ws, convertedUsersList);
        this.activeUsers = currentMessage['activeUsers'];
        this.inited = true;
      } else {
        if(currentMessage['To'] != this.broadcastId) {
          if(document.querySelectorAll('[title="' + currentMessage['Username'] + '"]').length < 2) {

          }
          const privateMessage = new Message();
          privateMessage.fromId = currentMessage['From'];
          privateMessage.toId = currentMessage['To'];
          privateMessage.message = currentMessage['Text'];
          privateMessage.dateSent = new Date(currentMessage['Time']);
          this.adapter.messages.push(privateMessage);
        } else {
          if (!this.messages[currentMessage['To']]) {
            this.messages[currentMessage['To']] = [];
          }
          this.messages[currentMessage['To']].push(JSON.parse(event.data));
        }        
      }
    };
  }

  sendCommonMessage() {
    this.ws.send(JSON.stringify({'from': +localStorage.getItem('userId'), 'to': this.broadcastId, 'text': this.message, 'time': new Date().getTime()}));
  }

  logout() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
   }
    this.authorizationService.logout();
  }
}
