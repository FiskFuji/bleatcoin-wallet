import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Patron, PatronTiers, TierNumbers } from '../patron';
import { LogType } from '../logentry';
import { version } from '../version';

import { EditPatronDialogComponent } from './../edit-patron-dialog/edit-patron-dialog.component';
import { DeletePatronDialogComponent } from './../delete-patron-dialog/delete-patron-dialog.component';
import { BatchAddCoinsDialogComponent } from './../batch-add-coins-dialog/batch-add-coins-dialog.component';

import { AuthService } from '../auth.service';
import { PatronService } from '../patron.service';
import { LoggingService } from '../logging.service';
import { DownloadService } from '../download.service';
import { CookieService } from 'ngx-cookie-service';

interface FullPatron {
  p: Patron;
  coinControl?: FormControl;
}

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
  providers: [DatePipe],
})

export class ManagementPageComponent implements OnInit {
  versionNo: string = version;
  patronList: FullPatron[] = [];
  copyOfPatronList: FullPatron[] = [];
  availableTiers: string[] = PatronTiers;
  sortSelected = '';
  filterOptions: string[] = ['uu', 'ud', 'pu', 'pd', 'tu', 'td', 'cu', 'cd'];
  filterOptionsDisplay: string[] = [
    'Username (A -> Z)',
    'Username (Z -> A)',
    'Patreon Name (A -> Z)',
    'Patreon Name (Z -> A)',
    'Patron Tier (Low -> High)',
    'Patron Tier (High -> Low)',
    'Coins (Low -> High)',
    'Coins (High -> Low)',
  ];
  controlsHidden = false;
  requestInProgress = true;
  passedAuth = false;

  constructor(private Auth: AuthService,  private cookie: CookieService, private PatronServ: PatronService, private Log: LoggingService,
    private csv: DownloadService, private router: Router, readonly dialog: MatDialog, readonly snackBar: MatSnackBar,
    public datePipe: DatePipe) {
      if (!this.Auth.isAuthed()) {
        this.router.navigateByUrl('/Admin');
      }

      this.passedAuth = true;

      this.PatronServ.getPatronsList().subscribe(
        (patrons) => {
          for (let x = 0; x < patrons.length; ++x) {
            this.patronList.push({p: patrons[x], coinControl: new FormControl(patrons[x].coins, [
              Validators.min(-99999),
              Validators.max(99999)
            ])});
          }
          this.copyOfPatronList = this.patronList;
        },
        e => {},
        // finally
        () => {
        this.requestInProgress = false;
      });
    }

  ngOnInit() {
  }

  downloadAsCSV() {
    this.csv.getPatronDB().subscribe(
      (patronsJSON) => {
        let msg = 'id,username,realname,tier,coins\n';
        for (const p of patronsJSON) {
          msg += p.id + ',' + p.username + ',' + p.realname + ',' + p.tier + ',' + p.coins + '\n';
        }
        const blob = new Blob([msg], {type: 'text/csv'});
        const URL = window.URL.createObjectURL(blob);

        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, 'patrons.csv');
        } else {
          const a = document.createElement('a');
          a.href = URL;
          a.download = 'patrons.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(URL);
      },
      (error) => {
        this.snackBar.open('There was an error downloading the file.', 'Dismiss');
      },
      () => {
        // finally
      }
    );
  }

  generateNewId(): number {
    if (this.patronList.length === 0) {
      return 1;
    }

    return this.patronList[this.patronList.length - 1].p.id + 1;
  }

  coinsHigherThanInitial(i: number): boolean {
    // if the coins in the control are higher than the initial value return true.
    return (this.patronList[i].coinControl.value > this.patronList[i].p.coins) ? true : false;
  }

  coinsLowerThanInitial(i: number): boolean {
    // if the coins in the control are lower than the initial value return true.
    return (this.patronList[i].coinControl.value < this.patronList[i].p.coins) ? true : false;
  }

  increment(i: number) {
    const current = this.patronList[i].coinControl.value;
    this.patronList[i].coinControl.setValue(current + 1);
  }

  decrement(i: number) {
    const current = this.patronList[i].coinControl.value;
    this.patronList[i].coinControl.setValue(current - 1);
  }

  noCoinsChange(i: number): boolean {
    return (this.patronList[i].coinControl.value === this.patronList[i].p.coins) ? true : false;
  }

  getCoinDiff(i: number): number {
    return Math.abs(this.patronList[i].coinControl.value - this.patronList[i].p.coins);
  }

  assignClass(c: string) {
    return c;
  }

  generateDateString(): string {
    const LOGTIME = Date();
    const format = 'yyyy-MM-dd HH:mm:ss';

    return this.datePipe.transform(LOGTIME, format);
  }

  tierToNum(t: string): number {
    return TierNumbers[t] || 0;
  }

  isControlsHidden(): boolean {
    return this.controlsHidden;
  }

  setControlsHidden(b: boolean) {
    this.controlsHidden = b;
  }

  filterByCriterion() {
    switch (this.sortSelected) {
      case 'uu': {
        this.patronList.sort((a, b) => a.p.username.toLowerCase() < b.p.username.toLowerCase() ? -1
          : a.p.username.toLowerCase() > b.p.username.toLowerCase() ? 1 : 0);
        break;
      }
      case 'ud': {
        this.patronList.sort((a, b) => a.p.username.toLowerCase() > b.p.username.toLowerCase() ? -1
          : a.p.username.toLowerCase() < b.p.username.toLowerCase() ? 1 : 0);
        break;
      }
      case 'pu': {
        this.patronList.sort((a, b) => a.p.realname.toLowerCase() < b.p.realname.toLowerCase() ? -1
          : a.p.realname.toLowerCase() > b.p.realname.toLowerCase() ? 1 : 0);
        break;
      }
      case 'pd': {
        this.patronList.sort((a, b) => a.p.realname.toLowerCase() > b.p.realname.toLowerCase() ? -1
          : a.p.realname.toLowerCase() < b.p.realname.toLowerCase() ? 1 : 0);
        break;
      }
      case 'tu': {
        this.patronList.sort((a, b) => this.tierToNum(a.p.tier) < this.tierToNum(b.p.tier) ? -1
          : this.tierToNum(a.p.tier) > this.tierToNum(b.p.tier) ? 1 : 0);
        break;
      }
      case 'td': {
        this.patronList.sort((a, b) => this.tierToNum(a.p.tier) > this.tierToNum(b.p.tier) ? -1
          : this.tierToNum(a.p.tier) < this.tierToNum(b.p.tier) ? 1 : 0);
        break;
      }
      case 'cu': {
        this.patronList.sort((a, b) => a.p.coins < b.p.coins ? -1 : a.p.coins > b.p.coins ? 1 : 0);
        break;
      }
      case 'cd': {
        this.patronList.sort((a, b) => a.p.coins > b.p.coins ? -1 : a.p.coins < b.p.coins ? 1 : 0);
        break;
      }
      // default to sort ascending ID
      default:
        this.patronList.sort((a, b) => a.p.id < b.p.id ? -1 : a.p.id > b.p.id ? 1 : 0);
    }
  }

  updateCoins(index: number) {
    // Gives positive if adding coins, negative if subtracting coins.
    const val = this.patronList[index].coinControl.value - this.patronList[index].p.coins;

    // For logging.
    let lt: string;
    let msg: string;
    if (val > 0) {
      lt = LogType.add;
      msg = 'Added ' + val + ' coins to ' + this.patronList[index].p.realname + '. New total: ' + this.patronList[index].p.coins;
    } else {
      lt = LogType.sub;
      msg = 'Deducted ' + val + ' coins from ' + this.patronList[index].p.realname + '. New total: ' + this.patronList[index].p.coins;
    }

    // Call service to update DB using API.
    this.PatronServ.updatePatron(this.patronList[index].p).then(
      s => {
        // success
        this.snackBar.open(
          this.patronList[index].p.username + '\'s coins updated successfully.', 'Dismiss', {duration: 2500}
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
          (patrons) => {
            this.patronList = [];
            this.copyOfPatronList = [];
            for (let x = 0; x < patrons.length; ++x) {
              this.patronList.push({p: patrons[x], coinControl: new FormControl(patrons[x].coins, [
                Validators.min(-99999),
                Validators.max(99999)
              ])});
            }
            this.copyOfPatronList = this.patronList;
            this.sortSelected = '';
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
          (patrons) => {
            this.patronList = [];
            this.copyOfPatronList = [];
            for (let x = 0; x < patrons.length; ++x) {
              this.patronList.push({p: patrons[x], coinControl: new FormControl(patrons[x].coins, [
                Validators.min(-99999),
                Validators.max(99999)
              ])});
            }
            this.sortSelected = '';
            this.copyOfPatronList = this.patronList;
          },
          (e) => {
            // do nothing with error...
          },
          () => {
            // finally
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
              (patrons) => {
                this.patronList = [];
                this.copyOfPatronList = [];
                for (let x = 0; x < patrons.length; ++x) {
                  this.patronList.push({p: patrons[x], coinControl: new FormControl(patrons[x].coins, [
                    Validators.min(-99999),
                    Validators.max(99999)
                  ])});
                }
                this.sortSelected = '';
                this.copyOfPatronList = this.patronList;
              },
              (e) => {
                // do nothing with error...
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
          return (v.p.tier === result.selectedTier);
        });

        for (let i = 0; i < filteredPatronList.length; ++i) {
          filteredPatronList[i].p.coins += result.coins;

          // is this the last update?
          if (i === filteredPatronList.length - 1) {
            this.PatronServ.updatePatron(filteredPatronList[i].p).then(() => {
              this.PatronServ.getPatronsList().subscribe(
                (patrons) => {
                  this.patronList = [];
                  this.copyOfPatronList = [];
                  for (let x = 0; x < patrons.length; ++x) {
                    this.patronList.push({p: patrons[x], coinControl: new FormControl(patrons[x].coins, [
                      Validators.min(-99999),
                      Validators.max(99999)
                    ])});
                  }
                  this.sortSelected = '';
                  this.copyOfPatronList = this.patronList;
                },
                (e) => {
                  // do nothing with error...
                },
                () => {
                  // finally
                  let msg = 'Added ' + result.coins + ' coins to all ' + result.selectedTier + ' patrons. New totals: {';
                  for (let j = 0; j < filteredPatronList.length; j++) {
                    if (j === filteredPatronList.length - 1) {
                      msg += filteredPatronList[j].p.realname + ': ' + filteredPatronList[j].p.coins + '}';
                    } else {
                      msg += filteredPatronList[j].p.realname + ': ' + filteredPatronList[j].p.coins + ', ';
                    }
                  }

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
            this.PatronServ.updatePatron(filteredPatronList[i].p);
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
