import { Component, OnInit } from '@angular/core';
import {UtilsService} from '../utils.service';
import {ChatAdapter} from 'ng-chat';
import {MyAdapter} from './chat.adaper';
import {AuthorizationService} from '../AuthorizationService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  message = ''

  broadcastId = 1

  ws: WebSocket

  userId = 'Mike';

  public adapter: ChatAdapter = new MyAdapter();

  messages = {};

  constructor(public utilsService: UtilsService, private authorizationService: AuthorizationService) { }

  ngOnInit() {

    this.initWebSocket();

 //   this.messages['main'] = [['Mike', 'main1'], ['Angela', 'main2']];
//    this.messages['Mike'] = [['Mike', 'hey Angela!'], ['Angela', 'Hello Mike!']];
  }
  initWebSocket() {
    this.ws = new WebSocket('ws://localhost:8095/publish-message');

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({'userId': +localStorage.getItem('userId')}));
    };
    this.ws.onmessage = (event) => {
      alert(event.type);
      const currentMessage = JSON.parse(event.data);
      if (!this.messages[currentMessage['To']]) {
        this.messages[currentMessage['To']] = [];
      }
      this.messages[currentMessage['To']].push(JSON.parse(event.data));
    };
  }

  sendCommonMessage() {
    this.ws.send(JSON.stringify({'from': +localStorage.getItem('userId'), 'to': 1, 'text': this.message, 'time': new Date().getTime()}));
  }

  logout() {
    this.authorizationService.logout();
  }
}
