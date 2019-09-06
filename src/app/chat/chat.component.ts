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

  userId = 'Mike';

  public adapter: ChatAdapter = new MyAdapter();

  messages = {};

  constructor(public utilsService: UtilsService, private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.messages['main'] = [['Mike', 'main1'], ['Angela', 'main2']];
    this.messages['Mike'] = [['Mike', 'hey Angela!'], ['Angela', 'Hello Mike!']];

    //this.adapter.
  }

  logout() {
    this.authorizationService.logout();
  }
}
