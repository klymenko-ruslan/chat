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

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'chat', component: ChatComponent},
  { path: '**', component: ChatComponent}
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
    NgChatModule
  ],
  exports: [RouterModule],
  providers: [UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
