import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit {
  constructor(private cookie: CookieService) {}

  ngOnInit() {}

  get isAuthed() {
    return this.cookie.check('auth');
  }
}
