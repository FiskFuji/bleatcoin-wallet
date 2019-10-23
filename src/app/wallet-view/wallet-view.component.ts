import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Patron, TierNumbers} from '../patron';
import { version } from '../version';
import { AuthService } from './../auth.service';
import { PatronService } from '../patron.service';

@Component({
  selector: 'app-wallet-view',
  templateUrl: './wallet-view.component.html',
  styleUrls: ['./wallet-view.component.scss'],
})

export class WalletViewComponent implements OnInit {
  versionNo: string = version;
  requestInProgress = true;
  patronList: Patron[] = [];
  copyOfPatronList: Patron[] = [];
  sortSelected = '';
  filterOptions: string[] = ['uu', 'ud', 'tu', 'td', 'cu', 'cd'];
  filterOptionsDisplay: string[] = [
    'Username (A -> Z)',
    'Username (Z -> A)',
    'Patron Tier (Low -> High)',
    'Patron Tier (High -> Low)',
    'Coins (Low -> High)',
    'Coins (High -> Low)',
  ];

  constructor(private patronServ: PatronService, private Auth: AuthService) {
    this.patronServ.getPatronsList().subscribe(
      (pts) => {
        this.patronList = pts;
        this.copyOfPatronList = pts;
      },
      (e) => {},
      () => {
        this.requestInProgress = false;
      }
    );
  }

  ngOnInit() {
  }

  isAuthed(): boolean {
    return this.Auth.isAuthed();
  }

  tierToNum(t: string): number {
    return TierNumbers[t] || 0;
  }

  filterByCriterion() {
    switch (this.sortSelected) {
      case 'uu': {
        this.patronList.sort((a, b) => a.username.toLowerCase() < b.username.toLowerCase() ? -1
          : a.username.toLowerCase() > b.username.toLowerCase() ? 1 : 0);
        break;
      }
      case 'ud': {
        this.patronList.sort((a, b) => a.username.toLowerCase() > b.username.toLowerCase() ? -1
          : a.username.toLowerCase() < b.username.toLowerCase() ? 1 : 0);
        break;
      }
      case 'tu': {
        this.patronList.sort((a, b) => this.tierToNum(a.tier) < this.tierToNum(b.tier) ? -1
          : this.tierToNum(a.tier) > this.tierToNum(b.tier) ? 1 : 0);
        break;
      }
      case 'td': {
        this.patronList.sort((a, b) => this.tierToNum(a.tier) > this.tierToNum(b.tier) ? -1
          : this.tierToNum(a.tier) < this.tierToNum(b.tier) ? 1 : 0);
        break;
      }
      case 'cu': {
        this.patronList.sort((a, b) => a.coins < b.coins ? -1 : a.coins > b.coins ? 1 : 0);
        break;
      }
      case 'cd': {
        this.patronList.sort((a, b) => a.coins > b.coins ? -1 : a.coins < b.coins ? 1 : 0);
        break;
      }
      // default to sort ascending ID
      default:
        this.patronList.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    }
  }

  assignClass(c: string) {
    return c;
  }

  navByUrlPatreon() {
    window.open(
      'https://www.patreon.com/lustylamb',
      '_blank'
    );
  }

  navByUrlStream() {
    window.open(
      'https://www.picarto.tv/lustylamb',
      '_blank'
    );
  }

  navByUrlBCForm() {
    window.open(
      'http://bit.ly/BleatcoinShop',
      '_blank'
    );
  }

  navByUrlTOS() {
    window.open(
      'http://tinyurl.com/lustytos',
      '_blank'
    );
  }
}
