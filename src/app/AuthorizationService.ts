import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class AuthorizationService implements CanActivate {

  public static readonly authTokenKey = 'token';

  constructor(private router: Router) {}

  login(token: string, username: string, userId) {
    localStorage.setItem(AuthorizationService.authTokenKey, token);
    alert(userId);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    this.router.navigateByUrl('/chat');
  }

  logout() {
    localStorage.removeItem(AuthorizationService.authTokenKey);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem(AuthorizationService.authTokenKey);
  }

  isLoggedIn() {
    const token = this.getToken();
    return token != null && token !== '';
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
