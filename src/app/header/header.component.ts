import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../AuthorizationService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService) { }

  ngOnInit() {
  }

  logout() {
    this.authorizationService.logout();
  }
}
