import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import {FormsModule} from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { ChatComponent } from './chat/chat.component';
import {UtilsService} from './utils.service';
import {NgChatModule} from 'ng-chat';
import {HttpClientModule} from '@angular/common/http';
import {EntityHttpService} from './http-service';
import {AuthorizationService} from './AuthorizationService';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'chat', component: ChatComponent, canActivate: [AuthorizationService]},
  { path: '**', component: ChatComponent, canActivate: [AuthorizationService]}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    [RouterModule.forRoot(routes)],
    FormsModule,
    NgChatModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule
  ],
  exports: [RouterModule],
  providers: [UtilsService, EntityHttpService, AuthorizationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
