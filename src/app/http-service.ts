import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class EntityHttpService {

  static SERVICE_ADDRESS = '178.151.5.66'
  static SERVICE_PORT = '8095'
  static BASE_URL: string

  constructor(private http: HttpClient) {
    EntityHttpService.BASE_URL = 'http://' + EntityHttpService.SERVICE_ADDRESS + ':' + EntityHttpService.SERVICE_PORT + '/';
  }

  getBroadcastMessages(body) {
    return this.http.post(EntityHttpService.BASE_URL + 'd', body);
  }

  register(body) {
    return this.http.post(EntityHttpService.BASE_URL + 'register', body);
  }

  login(body) {
    return this.http.post(EntityHttpService.BASE_URL + 'login', body);
  }

}
