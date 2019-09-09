import { Component, OnInit } from '@angular/core';
import {EntityHttpService} from '../http-service';
import {AuthorizationService} from '../authorization.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {

  username = '';
  password = '';
  isMale = true;

  constructor(private entityHttpService: EntityHttpService,
              private authorizationService: AuthorizationService,
              private router: Router,
              private notificationService: NotificationsService) { }

  ngOnInit() {
  }


  register() {
    this.entityHttpService.register({'username': this.username, 'password': this.password, 'isMale': this.isMale}).subscribe(response => {
      if (response['Token']) {
        this.router.navigate(['/login']);
      }
    }, err => {
      if (err.status === 500) {
        this.notificationService.error('Error', 'User wasn\'t created. Please try another username.');
      }
    });
  }

}
