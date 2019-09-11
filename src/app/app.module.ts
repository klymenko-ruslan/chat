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
import {AuthorizationService} from './authorization.service';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {ByteconverterService} from './byteconverter-service';
import {NgxLoadingModule} from 'ngx-loading';

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
    ChatComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    [RouterModule.forRoot(routes)],
    FormsModule,
    NgChatModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot({timeOut: 4000, showProgressBar: true}),
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({})
  ],
  exports: [RouterModule],
  providers: [UtilsService, EntityHttpService, AuthorizationService, ByteconverterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
