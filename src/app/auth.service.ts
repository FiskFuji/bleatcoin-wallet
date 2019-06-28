/*
 * This service fetches users, and validates their credentials.
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

  constructor(readonly http: HttpClient, private cookie: CookieService) {
  }

  validateUser(username: string, password: string): Promise<boolean> {
    const URL = 'https://bleatcoin-admin.herokuapp.com/api/getUserByCredentials/' +  username + '/' + password;

    // Perform fetch
    const isValidPromise = new Promise<boolean>((resolve) => {
      this.http.post(URL, {}).subscribe(r => {
        const success = !r['error'];

        if (!success) {
          resolve(false);
        }

        // Successful auth
        if (success) {
          // Store cookie if it doesn't exist.
          const authed = this.cookie.check('auth');
          if (!authed) {
            this.cookie.set('auth', 'admin-account');
            this.cookie.set('user', username);
          }

          resolve(true);
        }
      });
    });

  return isValidPromise;
  }

  isAuthed(): boolean {
    return this.cookie.check('auth');
  }
}