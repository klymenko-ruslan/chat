import { Component, OnInit } from '@angular/core';
import {MyAdapter} from './chat.adaper';
import {AuthorizationService} from '../authorization.service';
import {ChatParticipantStatus, ChatParticipantType, Message} from 'ng-chat';
import {ByteconverterService} from '../byteconverter-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  loaded = false

  socketAddress = 'ws://localhost:8095/socket-channel'

  message = ''

  broadcastId = 1

  ws: WebSocket

  userId = +localStorage.getItem('userId');

  public adapter: MyAdapter;

  activeUsers = []

  convertedActiveUsersList = []

  messages = {};

  constructor(private authorizationService: AuthorizationService,
              private byteConvertorService: ByteconverterService) { }

  ngOnInit() {
    this.initWebSocket();
  }



  initWebSocket() {
    this.ws = new WebSocket(this.socketAddress);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = () => {
      const onOpenMessage = JSON.stringify({'Token': localStorage.getItem(AuthorizationService.authTokenKey), 'ConnectedUserId': +localStorage.getItem('userId')});
      this.ws.send(this.byteConvertorService.stringToBytes(onOpenMessage));
      setInterval(() => {
        const heartBeatMessage = JSON.stringify({'HeartbeatUserId': +localStorage.getItem('userId')});
        this.ws.send(this.byteConvertorService.stringToBytes(heartBeatMessage));
      }, 2000);
    };
    this.ws.onmessage = (event) => {
      const data = this.byteConvertorService.bytesToString(new Uint8Array(event.data));
      if (data.indexOf('logout') != -1) {
        this.authorizationService.logout();
      } else {
        const currentMessage = JSON.parse(data);
        if (JSON.stringify(currentMessage).indexOf('activeUsers') != -1) {
          if (currentMessage['activeUsers']) {
            this.setUpActiveUsers(currentMessage);
          }
        } else if (currentMessage['NewActiveUserId']) {
          this.addActiveUser(currentMessage);
        } else if (currentMessage['DisconnectedUserId']) {
          this.removeUser(currentMessage['DisconnectedUserId']);
        } else {
          if (currentMessage['To'] != this.broadcastId) {
            this.receivePrivateMessage(currentMessage);
          } else {
            this.receiveBroadcastMessage(currentMessage);
          }
        }
      }

    };
  }

  receivePrivateMessage(currentMessage) {
    const privateMessage = new Message();
    privateMessage.fromId = currentMessage['From'];
    privateMessage.toId = currentMessage['To'];
    privateMessage.message = currentMessage['Text'];
    privateMessage.dateSent = new Date(currentMessage['Time']);
    this.adapter.messages.push(privateMessage);
    if ((document.querySelectorAll('[title="' + currentMessage['FromUsername'] + '"]').length > 1)) {
      (document.getElementsByClassName('ng-chat-close primary-text')[0] as HTMLElement).click();
    }
    (document.querySelectorAll('[title="' + currentMessage['FromUsername'] + '"]')[0] as HTMLElement).click();

  }

  receiveBroadcastMessage(currentMessage) {
    if (!this.messages[currentMessage['To']]) {
      this.messages[currentMessage['To']] = [];
    }
    this.messages[currentMessage['To']].push(currentMessage);
  }

  removeUser(userId) {
    this.convertedActiveUsersList.forEach((it, indx) => {
      if(it.id == userId) {
        this.convertedActiveUsersList.splice(indx, 1);
      }
    });
  }

  addActiveUser(message) {
    if(this.convertedActiveUsersList.filter(it => it.id == message['NewActiveUserId']).length == 0) {
      this.convertedActiveUsersList.push(
        {
          participantType: ChatParticipantType.User,
          id: message['NewActiveUserId'],
          displayName: message['NewActiveUserName'],
          avatar: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj',
          status: ChatParticipantStatus.Online
        }
      );
    }
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
    if (this.message.length > 0) {
      const messageText = JSON.stringify({'token': localStorage.getItem(AuthorizationService.authTokenKey), 'from': +localStorage.getItem('userId'), 'to': this.broadcastId, 'text': this.message, 'time': new Date().getTime()});
      this.ws.send(this.byteConvertorService.stringToBytes(messageText));
      this.message = '';
    }
  }

  logout() {
    this.ws.close();
    this.authorizationService.logout();
  }

  getUsername() {
    return localStorage.getItem('username');
  }
}
