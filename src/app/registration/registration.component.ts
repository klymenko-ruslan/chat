import { Component, OnInit } from '@angular/core';
import {EntityHttpService} from '../http-service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {

  username = '';
  password = '';
  isMale = true;

  constructor(private entityHttpService: EntityHttpService) { }

  ngOnInit() {
  }


  register() {
    this.entityHttpService.register({'username': this.username, 'password': this.password, 'isMale': this.isMale}).subscribe(response => {
      alert(JSON.stringify(response));
    });
  }

}
