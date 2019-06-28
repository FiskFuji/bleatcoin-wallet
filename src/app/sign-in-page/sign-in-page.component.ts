import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {
  username = '';
  password = '';
  requestInProgress = false;
  hasNotBeenAuthed = false;

  usernameControl: FormControl;
  passwordControl: FormControl;

  constructor(private Auth: AuthService,  private cookie: CookieService,
              private router: Router, readonly snackBar: MatSnackBar) {
    this.usernameControl = new FormControl(this.username);
    this.passwordControl = new FormControl(this.password, [Validators.required]);

    if (this.Auth.isAuthed()) {
      this.router.navigateByUrl('/Manage');
    }

    // Passed the Auth service check, have not been authed yet.
    this.hasNotBeenAuthed = true;
  }

  ngOnInit() {
  }

  login() {
    // Update component values.
    this.username = this.usernameControl.value;
    this.password = this.passwordControl.value;

    // Password required snackbar.
    if (this.password.length === 0) {
      this.snackBar.open('A password is required!', 'Dismiss', {duration: 2500});
      return;
    }

    // Signify a request is in progress for the UI.
    this.requestInProgress = true;

    // Validate the user credentials.
    let success: boolean;
    this.Auth.validateUser(this.username, this.password).then((v) => {
      success = v;
      this.requestInProgress = false;

      if (success) {
        this.router.navigateByUrl('/Manage');
      } else {
        // Unsuccessful auth.
        this.snackBar.open('Invalid login!', 'Dismiss', {duration: 5000});
        this.usernameControl.setValue('');
        this.passwordControl.setValue('');
      }
    });
  }
}
