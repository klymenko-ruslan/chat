import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class EntityHttpService {

  BASE_URL: string

  constructor(private http: HttpClient) {
    this.BASE_URL = 'http://localhost:8095/';
  }

  getBroadcastMessages(body) {
    return this.http.post(this.BASE_URL + 'd', body);
  }

  register(body) {
    return this.http.post(this.BASE_URL + 'register', body);
  }

  login(body) {
    return this.http.post(this.BASE_URL + 'login', body);
  }

}
