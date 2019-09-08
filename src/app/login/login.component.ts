import { Component, OnInit } from '@angular/core';
import {EntityHttpService} from '../http-service';
import {AuthorizationService} from '../AuthorizationService';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';

  constructor(private entityHttpService: EntityHttpService,
              private authorizationService: AuthorizationService,
              private notificationService: NotificationsService) { }

  ngOnInit() {
  }

  login() {
    this.authorizationService.login('a', 'b', 'c');
    // this.entityHttpService.login({'username': this.username, 'password': this.password}).subscribe(response => {
    //   if (response) {
    //     this.authorizationService.login(response['Token'], this.username, response['UserId']);
    //   } else {
    //     this.notificationService.error('Authorization failed', 'Wrong username/password pair');
    //   }
    // });
  }

}
