import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../authorization.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService) { }

  ngOnInit() {
  }

  loggedIn() {
    return localStorage.getItem(AuthorizationService.authTokenKey);
  }

  logout() {
    this.authorizationService.logout();
  }
}
