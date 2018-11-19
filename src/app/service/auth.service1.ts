import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as Auth0 from 'auth0-js';
import Auth0Cordova from '@auth0/cordova';

import { environment } from '../../environments/environment';


@Injectable()
export class AuthService1 {

  auth0: any;
  accessToken: string;
  idToken: string;
  user: any;

  isLoggedIn$ = new Subject();
  isLoggedIn: Boolean = false;

  constructor(
    public router: Router
  ) {
    this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
    // Check if user is logged In when Initializing
    const loggedIn = this.isLoggedIn = this.isAuthenticated();
    this.isLoggedIn$.next(loggedIn);
  }

  private getStorageVariable(name) {
    return JSON.parse(window.localStorage.getItem(name));
  }

  private setStorageVariable(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  private setIdToken(token) {
    this.idToken = token;
    this.setStorageVariable('id_token', token);
  }

  private setAccessToken(token) {
    this.accessToken = token;
    this.setStorageVariable('access_token', token);
  }

  public isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    let time = new Date().getTime();
    if (!( time < expiresAt) || !this.getStorageVariable('profile')) {
      this.clearSession();
      return false;
    }else{
      return true;
    }
    // return time < expiresAt;
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
      } else if (err) {
        
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {

    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (err) {
        throw err;
      }

      if (profile) {
        this.setStorageVariable('profile', this.senitizeProfile(profile));
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        this.setIdToken(authResult.idToken);
        this.setAccessToken(authResult.accessToken);
        this.setStorageVariable('expires_at', expiresAt);
        console.log("Custom Login Token: ", profile.firebase.token);
        console.log("Profile: ", profile);
        const loggedIn = this.isLoggedIn = true;
        this.isLoggedIn$.next(loggedIn);
        this.router.navigate(['/home']);
      };

    });

  }

  public senitizeProfile(profile) {

    profile.user_metadata = profile.user_metadata || {};

    profile.auth = profile["http://sbfl.com/profile/auth"] || {}
    profile.fitbit = profile["http://sbfl.com/profile/auth"] || {}
    delete profile["http://sbfl.com/profile/auth"];

    profile.identities = profile["http://sbfl.com/profile/identities"] || {}
    delete profile["http://sbfl.com/profile/identities"];

    profile.identities.map((elem, i) => {
      var key = elem.provider;
      profile.identities.splice(i, 1);
      profile.identities[key] = elem;
      return;
    });

    profile.groups = profile["http://sbfl.com/groups"] || {}
    delete profile["http://sbfl.com/groups"];

    let data = profile["http://sbfl.com/profile/data"] || {}
    delete profile["http://sbfl.com/profile/data"];
    for (var attrname in data) { profile[attrname] = data[attrname]; }

    profile.firebase = profile["http://sbfl.com/profile/firebase"] || {}
    delete profile["http://sbfl.com/profile/firebase"];

    return profile;
  }

  public login() {
    
    const client = new Auth0Cordova(environment.auth0Config.app);

    const options = {
      scope: 'openid profile offline_access'
    };

    client.authorize(options, (err, authResult) => {
      if (err) {
        // console.log(err);
        throw err;
      }
      this.setSession(authResult);
      
    });
  }

  public clearSession() {
    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');
    window.localStorage.removeItem('lat');
    window.localStorage.removeItem('lng');

    this.idToken = null;
    this.accessToken = null;
    this.user = null;

    
  }
  public logout() {
    
    this.clearSession();
    
    
  }
}
