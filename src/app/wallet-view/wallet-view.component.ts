import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  selectedFilterTier: string;
  filterOptions: string[] = ['username', 'realname', 'tier'];
  filterOptionsDisplay: string[] = ['Username', 'Patreon Name', 'Patron Tier'];
  filterTextControl: FormControl;

  TEST_LIST: Patron[] = [
    {id: 1, username: 'Tycho', realname: 'Fisk', tier: 'Hatchling', coins: 10},
    {id: 2, username: 'Tycho', realname: 'Fisk', tier: 'Grub', coins: 10},
    {id: 3, username: 'Tycho', realname: 'Fisk', tier: 'Moth', coins: 10},
    {id: 4, username: 'Tycho', realname: 'Fisk', tier: 'Beetle', coins: 10},
    {id: 5, username: 'Tycho', realname: 'Fisk', tier: 'Cicada', coins: 10},
    {id: 6, username: 'Tycho', realname: 'Fisk', tier: 'Bumblebee', coins: 10},
    {id: 7, username: 'Tycho', realname: 'Fisk', tier: 'Mantid', coins: 10},
    {id: 8, username: 'Tycho', realname: 'Fisk', tier: 'Mantid', coins: 10},
    {id: 9, username: 'Tycho', realname: 'Fisk', tier: 'Mantid', coins: 10},
    {id: 10, username: 'Tycho', realname: 'Fisk', tier: 'Mantid', coins: 10},
    {id: 11, username: 'Tycho', realname: 'Fisk', tier: 'Mantid', coins: 10},
    {id: 12, username: 'Tycho', realname: 'Fisk', tier: 'Mantid', coins: 10},
  ];

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

  assignClass(c: string) {
    return c;
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
      case 'realname': {
        this.patronList = this.patronList.filter((v, i, a) => {
          return (v.realname.toLowerCase().includes(q));
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
