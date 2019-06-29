import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

import { Patron, PatronTiers } from '../patron';
import { version } from '../version';
import { AuthService } from './../auth.service';
import { PatronService } from '../patron.service';

@Component({
  selector: 'app-wallet-view',
  templateUrl: './wallet-view.component.html',
  styleUrls: ['./wallet-view.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('200ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ]
})

export class WalletViewComponent implements OnInit {
  versionNo: string = version;
  requestInProgress = true;
  patronList: Patron[] = [];
  copyOfPatronList: Patron[] = [];
  availableTiers: string[] = PatronTiers;
  selectedSearch: string;
  sortSelected = '';
  selectedFilterTier: string;
  filterOptions: string[] = ['username', 'tier'];
  filterOptionsDisplay: string[] = ['Username', 'Patron Tier'];
  filterTextControl: FormControl;
  headerContentHidden = false;

  constructor(private patronServ: PatronService, private Auth: AuthService) {
    this.filterTextControl = new FormControl({value: undefined, disabled: true});

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
    switch (t) {
      case 'Past Patron':
        return 1;
      case 'Hatchling':
        return 2;
      case 'Grub':
        return 3;
      case 'Moth':
        return 4;
      case 'Beetle':
        return 5;
      case 'Cicada':
        return 6;
      case 'Bumblebee':
        return 7;
      case 'Mantid':
        return 8;
    }
  }

  isHeaderContentHidden(): boolean {
    return this.headerContentHidden;
  }

  setHeaderContentHidden(b: boolean) {
    this.headerContentHidden = b;
  }

  getSortSelected(): string {
    return this.sortSelected;
  }

  isSortSelectedEmptyOrUndef(): boolean {
    if (this.sortSelected === undefined) {
      return true;
    }
    if (this.sortSelected === '') {
      return true;
    }
    return false;
  }

  setSortSelected(q: string) {
    this.sortSelected = q;

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
    }
  }

  resetSort() {
    this.requestInProgress = true;
    this.sortSelected = '';
    this.patronList.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    this.requestInProgress = false;
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

  isSelectedSearchEmptyOrUndef() {
    if (this.selectedSearch === undefined) {
      return true;
    }
    if (this.selectedSearch === '') {
      return true;
    }
    return false;
  }

  isSelectedSearchEmpty(): boolean {
    if (this.selectedSearch === '' || this.selectedSearch === undefined) {
      this.filterTextControl.setValue(undefined);
      this.patronList = this.copyOfPatronList;
      return true;
    }
    return false;
  }

  get selectedSearchIsTier() {
    return this.selectedSearch === 'tier';
  }

  // this should only be called if there is a value in mat-select, otherwise input is disabled.
  filterByCritereon() {
    let q: string;
    this.patronList = this.copyOfPatronList;

    if (this.selectedSearchIsTier) {
      q = this.selectedFilterTier;
    } else {
      q = this.filterTextControl.value;
    }

    if (q === '' || q === undefined) {
      return;
    }

    q = q.toLowerCase();
    switch (this.selectedSearch) {
      case 'username': {
        this.patronList = this.patronList.filter((v, i, a) => {
          return (v.username.toLowerCase().includes(q));
        });
        break;
      }
      case 'tier': {
        this.patronList = this.patronList.filter((v, i, a) => {
          return (v.tier.toLowerCase().includes(q));
        });
        break;
      }
      default: {
        break;
      }
    }
  }
}
