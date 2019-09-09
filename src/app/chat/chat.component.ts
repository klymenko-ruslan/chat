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

  messages = {};

  constructor(public utilsService: UtilsService, private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.initWebSocket();
  }

  bytesToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  stringToBytes(str) {
    const buf = new ArrayBuffer(str.length * 2);
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  initWebSocket() {
    this.ws = new WebSocket(this.socketAddress);

    this.ws.onopen = () => {
      const onOpenMessage = JSON.stringify({'Token': localStorage.getItem(AuthorizationService.authTokenKey), 'ConnectedUserId': +localStorage.getItem('userId')});
      this.ws.send(this.stringToBytes(onOpenMessage));
      setInterval(() => {
        const heartBeatMessage = JSON.stringify({'HeartbeatUserId': +localStorage.getItem('userId')});
        this.ws.send(this.stringToBytes(heartBeatMessage));
      }, 2000);
    };
    this.ws.onmessage = (event) => {
      if (event.data.indexOf('logout') != -1) {
        this.authorizationService.logout();
      } else {
        const currentMessage = JSON.parse(event.data);
        if (JSON.stringify(currentMessage).indexOf('activeUsers') != -1) {
          if  (currentMessage['activeUsers']) {
            this.setUpActiveUsers(currentMessage);
          }
          this.openActiveUserChats(currentMessage['Username']);
        } else if (currentMessage['NewActiveUserId']) {
          this.addActiveUser(currentMessage);
        } else if (currentMessage['DisconnectedUserId']) {
          this.removeUser(currentMessage['DisconnectedUserId']);
        } else {
          if(currentMessage['To'] != this.broadcastId) {
            this.receivePrivateMessage(currentMessage);
          } else {
            this.receiveBroadcastMessage(currentMessage, event);
          }
        }
      }

    };
  }

  openActiveUserChats(username) {
    // this.activeUsers.forEach(it => {
    //   if(document.querySelectorAll('[title="' + username + '"]').length < 2) {
    //     (document.querySelectorAll('[title="' + username + '"]')[0]  as HTMLElement).click();
    //   }
    // });
  }

  receivePrivateMessage(currentMessage) {
    const privateMessage = new Message();
    privateMessage.fromId = currentMessage['From'];
    privateMessage.toId = currentMessage['To'];
    privateMessage.message = currentMessage['Text'];
    privateMessage.dateSent = new Date(currentMessage['Time']);
    this.adapter.messages.push(privateMessage);
    if ((document.querySelectorAll('[title="' + currentMessage['FromUsername'] + '"]').length > 1)) {
      //todo: generalize for all
      (document.getElementsByClassName('ng-chat-close primary-text')[0] as HTMLElement).click();
    }
    (document.querySelectorAll('[title="' + currentMessage['FromUsername'] + '"]')[0] as HTMLElement).click();

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
      this.ws.send(this.stringToBytes(messageText));
      this.message = '';
    }
  }

  logout() {
    this.ws.close();
    this.authorizationService.logout();
  }
}
