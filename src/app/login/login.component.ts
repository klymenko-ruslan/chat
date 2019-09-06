import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  nickname = '';
  password = '';

  constructor() { }

  ngOnInit() {
  }

  login() {
    alert(this.nickname);
    alert(this.password);
  }

}
