import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

import { Patron, PatronTiers } from '../patron';
import { LogType } from '../logentry';
import { version } from '../version';

import { EditPatronDialogComponent } from './../edit-patron-dialog/edit-patron-dialog.component';
import { DeletePatronDialogComponent } from './../delete-patron-dialog/delete-patron-dialog.component';
import { BatchAddCoinsDialogComponent } from './../batch-add-coins-dialog/batch-add-coins-dialog.component';

import { AuthService } from '../auth.service';
import { PatronService } from '../patron.service';
import { LoggingService } from '../logging.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
  providers: [DatePipe],
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

export class ManagementPageComponent implements OnInit {
  versionNo: string = version;
  patronList: Patron[] = [];
  copyOfPatronList: Patron[] = [];
  controls: FormControl[] = [];
  availableTiers: string[] = PatronTiers;
  selectedSearch = '';
  selectedFilterTier: string;
  sortSelected = '';
  filterOptions: string[] = ['username', 'realname', 'tier'];
  filterOptionsDisplay: string[] = ['Username', 'Patreon Name', 'Patron Tier'];
  filterTextControl: FormControl;
  controlsHidden = false;
  headerContentHidden = false;
  requestInProgress = true;
  passedAuth = false;

  constructor(private Auth: AuthService,  private cookie: CookieService, private PatronServ: PatronService, private Log: LoggingService,
    private router: Router, readonly dialog: MatDialog, readonly snackBar: MatSnackBar, public datePipe: DatePipe) {
      if (!this.Auth.isAuthed()) {
        this.router.navigateByUrl('/Admin');
      }

      this.passedAuth = true;
      this.filterTextControl = new FormControl({value: undefined, disabled: true});

      this.PatronServ.getPatronsList().subscribe(
        (patrons) => {
          this.patronList = patrons;
          this.copyOfPatronList = patrons;
        },
        e => {},
        // finally
        () => {
        for (let x = 0; x < this.patronList.length; x++) {
          this.controls.push(new FormControl(0, [
            Validators.min(-99999),
            Validators.max(99999)
          ]));
        }
        this.requestInProgress = false;
      });
    }

  ngOnInit() {
  }

  generateNewId(): number {
    if (this.patronList.length === 0) {
      return 1;
    }

    return this.patronList[this.patronList.length - 1].id + 1;
  }

  generateDateString(): string {
    const LOGTIME = Date();
    const format = 'yyyy-MM-dd HH:mm:ss';

    return this.datePipe.transform(LOGTIME, format);
  }

  get selectedSearchIsTier() {
    return this.selectedSearch === 'tier';
  }

  noFilterSelected(): boolean {
    return (this.selectedSearch === '' || this.selectedSearch === undefined);
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

  isControlsHidden(): boolean {
    return this.controlsHidden;
  }

  setControlsHidden(b: boolean) {
    this.controlsHidden = b;
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
      case 'pu': {
        this.patronList.sort((a, b) => a.realname.toLowerCase() < b.realname.toLowerCase() ? -1
          : a.realname.toLowerCase() > b.realname.toLowerCase() ? 1 : 0);
        break;
      }
      case 'pd': {
        this.patronList.sort((a, b) => a.realname.toLowerCase() > b.realname.toLowerCase() ? -1
          : a.realname.toLowerCase() < b.realname.toLowerCase() ? 1 : 0);
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

  incrementCoinCounter(index: number) {
    this.controls[index].setValue(this.controls[index].value + 1);
  }

  decrementCoinCounter(index: number) {
    this.controls[index].setValue(this.controls[index].value - 1);
  }

  updateCoins(index: number) {
    const val = this.controls[index].value;

    // Adds current value of coins form to patron coins regardless of sign.
    this.patronList[index].coins += val;

    // for logging
    let lt: string;
    let msg: string;
    if (val > 0) {
      lt = LogType.add;
      msg = 'Added ' + val + ' coins to ' + this.patronList[index].realname + '. New total: ' + this.patronList[index].coins;
    } else {
      lt = LogType.sub;
      msg = 'Deducted ' + val + ' coins from ' + this.patronList[index].realname + '. New total: ' + this.patronList[index].coins;
    }

    // Reset value on form.
    this.controls[index].setValue(0);

    // Call service to update DB using API.
    this.PatronServ.updatePatron(this.patronList[index]).then(
      s => {
        // success
        this.snackBar.open(
          this.patronList[index].username + '\'s coins updated successfully.', 'Dismiss', {duration: 2500}
        );

        this.Log.createLog(
          this.generateDateString(),
          lt,
          msg
        );
      },
      f => {
        // failure
        this.snackBar.open(
          'Patron info not updated. Refreshing...', 'Dismiss', {duration: 3000}
        );
        this.requestInProgress = true;
        this.PatronServ.getPatronsList().subscribe(
          (pts) => {
            this.patronList = pts;
            this.copyOfPatronList = pts;
          },
          (e) => {
            // do nothing with error...
          },
          () => {
            // no longer processing request.
            this.requestInProgress = false;
          }
        );
      }
    );
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

  openEditPatronDialog(pat: Patron) {
    const dialogRef = this.dialog.open(EditPatronDialogComponent, {
      data: {patron: pat, addingNewPatron: false},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // if result updated then successfully updated.
      if (result.action === 'updated') {
        this.snackBar.open(pat.username + '\'s info successfully updated!', 'Dismiss', {duration: 2500});
      }

      // if result failed then error'd out on update.
      if (result.action === 'failed') {
        this.snackBar.open('An error occurred during update.', 'Dismiss', {duration: 2500});
      }

      // do nothing for close.
    });
  }

  openAddPatronDialog() {
    const newID = this.generateNewId();
    const dialogRef = this.dialog.open(EditPatronDialogComponent, {
      data: {addingNewPatron: true, id: newID},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // if result added then a patron was added.
      if (result.action === 'added') {
        this.requestInProgress = true;

        this.PatronServ.getPatronsList().subscribe(
          (pts) => {
            this.patronList = pts;
            this.copyOfPatronList = pts;
          },
          (e) => {},
          () => {
            // reset form controls
            this.controls = [];
            for (let x = 0; x < this.patronList.length; x++) {
              this.controls.push(new FormControl(0, [
                Validators.min(-99999),
                Validators.max(99999)
              ]));
            }
            this.requestInProgress = false;
            this.snackBar.open('Successfully added a new patron!', 'Dismiss', {duration: 2500});
          });
      }

      // if result failed then error'd out on addition.
      if (result.action === 'failed') {
        this.snackBar.open('An error occured during adding a patron.', 'Dismiss', {duration: 2500});
      }

      // do nothing for close.
    });
  }

  openDeletePatronDialog(pat: Patron) {
    const dialogRef = this.dialog.open(DeletePatronDialogComponent, {
      data: pat.realname,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // if true, delete
      if (result) {
        this.requestInProgress = true;

        this.PatronServ.deletePatron(pat.id).then(
          (res) => {
            // success
            const msg = 'Deleted ' + pat.realname + ' from the patron list. (Coins: ' + pat.coins + ')';
            this.Log.createLog(
              this.generateDateString(),
              LogType.del,
              msg
            );

            this.snackBar.open('Patron ' + pat.realname + ' deleted successfully.', 'Dismiss', {
              duration: 3000
            });

            this.PatronServ.getPatronsList().subscribe(
              (pts) => {
                this.patronList = pts;
                this.copyOfPatronList = pts;
              },
              (e) => {
                // do nothing with error
              },
              () => {
                // finally
                this.requestInProgress = false;
              }
            );
          },
          (err) => {
            // error
            this.snackBar.open('Error: Patron not deleted successfully.', 'Dismiss', {
              duration: 3000
            });
          }
        );
      }
    });
  }

  openBatchCoinAddDialog() {
    const dialogRef = this.dialog.open(BatchAddCoinsDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // if true coins added
      if (result.added) {
        this.requestInProgress = true;

        const filteredPatronList = this.patronList.filter((v, i, a) => {
          return (v.tier === result.selectedTier);
        });

        for (let i = 0; i < filteredPatronList.length; ++i) {
          filteredPatronList[i].coins += result.coins;

          // is this the last update?
          if (i === filteredPatronList.length - 1) {
            this.PatronServ.updatePatron(filteredPatronList[i]).then(() => {
              this.PatronServ.getPatronsList().subscribe(
                (pts) => {
                  this.patronList = pts;
                  this.copyOfPatronList = pts;
                },
                (e) => {
                  // do nothing with errors
                },
                () => {
                  const msg = 'Added ' + result.coins + ' coins to all ' + result.selectedTier + ' patrons.';
                  this.Log.createLog(
                    this.generateDateString(),
                    LogType.batch,
                    msg
                  );

                  this.snackBar.open(result.coins + ' coins added to ' + result.selectedTier + ' tier!', 'Dismiss', {duration: 3000});

                  this.requestInProgress = false;
                }
              );
            });
          } else {
            this.PatronServ.updatePatron(filteredPatronList[i]);
          }
        }
      }
    });
  }

  logout() {
    // Delete the authentication cookie and username cookie.
    this.cookie.delete('auth');
    this.cookie.delete('user');

    if (this.cookie.check('log-delete-warned')) {
      this.cookie.delete('log-delete-warned');
    }

    this.router.navigateByUrl('/Admin');
    this.snackBar.open('Logged Out!', 'Dismiss', {duration: 4000});
  }
}
