import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '@app/app.config';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = this.appConfig.backendUrl;
  isLoggedIn = false;
  displayName = '';
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any
  ) {
    this.checkLoginStatus();
  }

  getJwtPayload(token: string) {
    if (!token) {
      console.log('no token provided');
      return;
    }
    const parts = token.split('.');
    return JSON.parse(atob(parts[1]));
  }

  checkLoginStatus(): void {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (
        currentUser.token &&
        this.getJwtPayload(currentUser.token)['exp'] > (Math.ceil(Date.now() / 1000))) {
          this.isLoggedIn = true;
          this.displayName = currentUser.displayName;
        }
    }
  }

  getAppConfig() {
    console.log(this.appConfig);
  }

  authenticate(user: { username: string, password: string }) {
    console.log('authenticating at backend', this.backendUrl);
    const authenticateUrl = environment.authUrl ? environment.authUrl : `${this.backendUrl}/authenticate`;
    const authReq = environment.authUrl ? this.http.post(authenticateUrl, {
      username: user.username,
      password: user.password
    }, { params: { path: 'authx' } }) : this.http.post(authenticateUrl, {
      username: user.username,
      password: user.password
    });
    return authReq
      .pipe(
        map((res: any) => {
          // console.log(res);
          const token = res['token'];
          const displayName = res['displayName'];
          const settings = res['settings'];
          localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            displayName,
            token,
            settings
          }));
          this.isLoggedIn = true;
        })
      )



    // .map(res => {
    //   if (res.json() && res.json()['token']) {
    //     // console.log(res.json());
    //     const token = res.json()['token'];
    //     const displayName = res.json()['displayName'];
    //     const settings = res.json()['settings'];
    //     localStorage.setItem('currentUser', JSON.stringify({
    //       username: user.username,
    //       displayName,
    //       token,
    //       settings
    //     }));
    //     // this.isLoggedInRxx.next(true);
    //     // const x = JSON.parse(localStorage.getItem('currentUser'));
    //     // console.log(x.token);
    //     // this.backend.rtcSocketInit();
    //     this.redirectAfterSuccess();
    //     return {ok: true};
    //   }
    //   return {ok: false};
    // })
    // .catch(err => {
    //   if (err.status === 401) {
    //     return Observable.of({
    //       ok: false,
    //       errorCode: 401,
    //       error: 'Unauthorized'
    //     });
    //   }
    //   return this.handleError(err);
    // });
  }
}
