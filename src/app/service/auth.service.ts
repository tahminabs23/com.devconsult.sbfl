import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as Auth0 from 'auth0-js';
import Auth0Cordova from '@auth0/cordova';

import { environment } from '../../environments/environment';

(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // auth0: any;

  isLoggedIn$ = new Subject();
  isLoggedIn: Boolean = false;

  auth0 = new Auth0.WebAuth(environment.auth0Config.web);

  constructor(
    public router: Router,
    public zone: NgZone,
    ) {
    // Check if user is logged In when Initializing
    const loggedIn = this.isLoggedIn = this.isAuthenticated();
    this.isLoggedIn$.next(loggedIn);

    

  }

  public login(): void {
    // this.auth0.authorize();

    const client = new Auth0Cordova(environment.auth0Config.app);

    const options = {
      scope: 'openid profile offline_access'
    };

    client.authorize(options, (err, authResult) => {
      if (err) {
        // console.log(err);
        throw err;
      }
      console.log(authResult);
      this.processauthentication(authResult, err);
    });
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      this.processauthentication(authResult, err)
    });
  }

  public processauthentication(authResult, err){
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      this.setSession(authResult);
      const loggedIn = this.isLoggedIn = true;
      this.isLoggedIn$.next(loggedIn);
      this.router.navigate(['/']);
      this.zone.run(() => {
        // this.user = profile;
      });
    } else if (err) {
      const loggedIn = this.isLoggedIn = false;
      this.isLoggedIn$.next(loggedIn);
      this.router.navigate(['/']);
      this.zone.run(() => {
        // this.user = profile;
      });
    }
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    const loggedIn = this.isLoggedIn = false;
    this.isLoggedIn$.next(loggedIn);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }
}




// // import { Injectable } from '@angular/core';
// import { Injectable, NgZone } from '@angular/core';
// import { Storage } from '@ionic/storage';
// // Import AUTH_CONFIG, Auth0Cordova, and auth0.js
// import Auth0Cordova from '@auth0/cordova';
// import * as auth0 from 'auth0-js';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {



//   Auth0 = new auth0.WebAuth(this.AUTH_CONFIG);
//   Client = new Auth0Cordova(this.AUTH_CONFIG);
//   accessToken: string;
//   user: any;
//   loggedIn: boolean;
//   loading = true;

//   constructor(
//     public zone: NgZone,
//     private storage: Storage
//   ) {
//     this.storage.get('profile').then(user => this.user = user);
//     this.storage.get('access_token').then(token => this.accessToken = token);
//     this.storage.get('expires_at').then(exp => {
//       this.loggedIn = Date.now() < JSON.parse(exp);
//       this.loading = false;
//     });
//   }

//   login() {
//     this.loading = true;
//     const options = {
//       scope: 'openid profile offline_access'
//     };
//     // Authorize login request with Auth0: open login page and get auth results
//     this.Client.authorize(options, (err, authResult) => {
//       if (err) {
//         throw err;
//       }
//       // Set Access Token
//       this.storage.set('access_token', authResult.accessToken);
//       this.accessToken = authResult.accessToken;
//       // Set Access Token expiration
//       const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
//       this.storage.set('expires_at', expiresAt);
//       // Set logged in
//       this.loading = false;
//       this.loggedIn = true;
//       // Fetch user's profile info
//       this.Auth0.client.userInfo(this.accessToken, (err, profile) => {
//         if (err) {
//           throw err;
//         }
//         this.storage.set('profile', profile).then(val =>
//           this.zone.run(() => this.user = profile)
//         );
//       });
//     });
//   }

//   logout() {
//     this.storage.remove('profile');
//     this.storage.remove('access_token');
//     this.storage.remove('expires_at');
//     this.accessToken = null;
//     this.user = null;
//     this.loggedIn = false;
//   }
// }

// // ionic cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=com.devconsult.sbfl --variable ANDROID_SCHEME=com.devconsult.sbfl --variable ANDROID_HOST=sbfl-development.auth0.com --variable ANDROID_PATHPREFIX=/cordova/com.devconsult.sbfl/callback