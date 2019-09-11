import { Component, OnInit } from '@angular/core';
import {EntityHttpService} from '../http-service';
import {AuthorizationService} from '../authorization.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public loading = false;

  username = '';
  password = '';

  constructor(private entityHttpService: EntityHttpService,
              private authorizationService: AuthorizationService,
              private notificationService: NotificationsService) { }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    this.entityHttpService.login({'username': this.username, 'password': this.password}).subscribe(response => {
      if (response) {
        this.authorizationService.login(response['Token'], this.username, response['UserId']);
      } else {
        this.notificationService.error('Authorization failed', 'Wrong username/password pair');
      }
      this.loading = false;
    }, () => this.loading = false);
  }

}
