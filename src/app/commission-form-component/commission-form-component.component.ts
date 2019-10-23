import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Patron, PatronTiers } from '../patron';

interface Theme {
  theme: string;
  priority: number;
}

@Component({
  selector: 'app-commission-form-component',
  templateUrl: './commission-form-component.component.html',
  styleUrls: ['./commission-form-component.component.scss']
})
export class CommissionFormComponentComponent implements OnInit {
  imgUrlList: string[];
  maxResList: string[];
  themesList: Theme[];
  controls: FormControl[] = [];
  maxRes: string;

  fakePatron: Patron = {
    id: 3,
    username: 'Ghost',
    realname: 'Nathan Clarke',
    tier: 'Mantid',
    coins: 11
  };

  fakePatron2: Patron = {
    id: 6,
    username: 'Rabbit',
    realname: 'RennyRabbit',
    tier: 'Firefly',
    coins: 122
  };

  FAKE_PATRONS = [this.fakePatron, this.fakePatron2];

  constructor() {
    this.imgUrlList = [
      'https://static1.e621.net/data/bd/71/bd7176bacb0fbfa725b19a8b8692e237.png',
      'https://static1.e621.net/data/93/a8/93a864f4a1ef9289b5ccc87134b50db3.jpg',
      'https://static1.e621.net/data/24/86/248607e8bc20fe7c19cb94c9bb15c044.png'
    ];

    this.themesList = [
      {theme: 'Extreme french kissing', priority: 1},
      {theme: 'Anal penetration', priority: 3},
      {theme: 'Domination', priority: 1},
      {theme: 'Face fucking', priority: 2},
      {theme: 'Rimming', priority: 4},
      {theme: 'Low priority kink', priority: 5}
    ];

    this.themesList.sort((a, b) => a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0);

    this.maxResList = ['128px', '256px', '512px', '768px'];
    this.maxRes = this.maxResList[1]; // 256px

    for (let x = 0; x < this.FAKE_PATRONS.length; ++x) {
      this.controls.push(new FormControl(this.FAKE_PATRONS[x].coins, [
        Validators.min(-99999),
        Validators.max(99999)
      ]));
    }
  }

  coinsHigherThanInitial(i: number): boolean {
    // if the coins in the control are higher than the initial value return true.
    return (this.controls[i].value > this.FAKE_PATRONS[i].coins) ? true : false;
  }

  coinsLowerThanInitial(i: number): boolean {
    // if the coins in the control are lower than the initial value return true.
    return (this.controls[i].value < this.FAKE_PATRONS[i].coins) ? true : false;
  }

  increment(i: number) {
    const current: number = this.controls[i].value;
    this.controls[i].setValue(current + 1);
  }

  decrement(i: number) {
    const current: number = this.controls[i].value;
    this.controls[i].setValue(current - 1);
  }

  noCoinsChange(i: number): boolean {
    return (this.controls[i].value === this.FAKE_PATRONS[i].coins) ? true : false;
  }

  getCoinDiff(i: number): number {
    return Math.abs(this.controls[i].value - this.FAKE_PATRONS[i].coins);
  }

  ngOnInit() {}

  openImageNewTab(url: string) {
    window.open(url, '_blank');
  }

  assignClass(c: string) {
    return c;
  }

  get maxResPlus(): string {
    switch (this.maxRes) {
      case '128px':
        return '140px';
      case '256px':
        return '268px';
      case '512px':
        return '524px';
      case '768px':
        return '780px';
    }
  }

  getColor(p: number): string {
    switch (p) {
      case 1:
        return '#FF6048';
      case 2:
        return '#FFAF00';
      case 3:
        return '#FFFF00';
      case 4:
        return '#C2FF00';
      case 5:
        return '#00FF00';
      // default to 3
      default:
        return '#FFFF00';
    }
  }
}
