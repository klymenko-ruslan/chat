import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {

  nickname = '';
  password = '';
  male = true;

  constructor() { }

  ngOnInit() {
  }


  register() {
    alert(this.male);
  }

}
