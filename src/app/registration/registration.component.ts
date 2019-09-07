import { Component, OnInit } from '@angular/core';
import {EntityHttpService} from '../http-service';
import {AuthorizationService} from '../AuthorizationService';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {

  username = '';
  password = '';
  isMale = true;

  constructor(private entityHttpService: EntityHttpService,
              private authorizationService: AuthorizationService) { }

  ngOnInit() {
  }


  register() {
    this.entityHttpService.register({'username': this.username, 'password': this.password, 'isMale': this.isMale}).subscribe(response => {
      if (response['Token']) {
        this.authorizationService.login(response['Token'], this.username, response['UserId']);
      }
    });
  }

}
