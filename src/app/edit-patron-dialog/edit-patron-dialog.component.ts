import { Component, OnInit, Inject} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { Patron, PatronTiers } from '../patron';
import { LogType } from '../logentry';

import { PatronService } from '../patron.service';
import { LoggingService } from '../logging.service';

interface AddOrEditPatron {
  patron?: Patron;
  addingNewPatron: boolean;
  id?: number;
}

@Component({
  selector: 'app-edit-patron-dialog',
  templateUrl: './edit-patron-dialog.component.html',
  styleUrls: ['./edit-patron-dialog.component.scss'],
  providers: [DatePipe]
})

export class EditPatronDialogComponent implements OnInit {
  usernameControl: FormControl;
  patreonnameControl: FormControl;
  coinsControl: FormControl;
  patronTier: string;
  availableTiers: string[] = PatronTiers;
  currentPatron: Patron;
  patronInitialCoins: number;

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: AddOrEditPatron, readonly dialogRef: MatDialogRef<EditPatronDialogComponent>,
    private patronServ: PatronService, private Log: LoggingService, public datePipe: DatePipe) {
      if(data.addingNewPatron) {
        this.currentPatron = {
          id: data.id,
          username: '',
          realname: '',
          coins: 0,
          tier: ''
        };
        this.patronTier = this.availableTiers[0];
      } else {
        this.currentPatron = data.patron;
        this.patronInitialCoins = data.patron.coins;
        this.patronTier = this.currentPatron.tier;
      }

      this.usernameControl = new FormControl(this.currentPatron.username, [
        Validators.required,
        Validators.maxLength(32)
      ]);
      this.patreonnameControl = new FormControl(this.currentPatron.realname, [
        Validators.required,
        Validators.maxLength(32)
      ]);
      this.coinsControl = new FormControl(this.currentPatron.coins, [
        Validators.required,
        Validators.min(0)
      ]);
  }

  ngOnInit() {
  }

  isPatronTierEmpty() {
    return this.patronTier === '';
  }

  updateValues() {
    this.currentPatron.username = this.usernameControl.value;
    this.currentPatron.realname = this.patreonnameControl.value;
    this.currentPatron.coins = this.coinsControl.value;
    this.currentPatron.tier = this.patronTier;
  }

  generateDateString(): string {
    const LOGTIME = Date();
    const format = 'yyyy-MM-dd HH:mm:ss';

    return this.datePipe.transform(LOGTIME, format);
  }

  addPatron() {
    this.updateValues();
    this.patronServ.addPatron([this.currentPatron]).then(
      (r) => {
        // success
        const msg = 'Added ' + this.currentPatron.realname + ' as a new Patron.';
        this.Log.createLog(
          this.generateDateString(),
          LogType.create,
          msg
        );

        this.dialogRef.close({action: 'added'});
      },
      (e) => {
        // rejected
        this.dialogRef.close({action: 'failed'});
      }
    );
  }

  updatePatron() {
    this.updateValues();

    const cmsg = (this.currentPatron.coins > this.patronInitialCoins ?
      '(Added ' + (this.currentPatron.coins - this.patronInitialCoins) + ' coins.)' :
      '(Deducted ' + (this.patronInitialCoins - this.currentPatron.coins) + ' coins.)');

    this.patronServ.updatePatron(this.currentPatron).then(
      (r) => {
        // success
        const logmsg = 'Updated ' + this.currentPatron.realname + '\'s details. ' + cmsg + ' New total: ' + this.currentPatron.coins;
        this.Log.createLog(
          this.generateDateString(),
          LogType.edit,
          logmsg
        );

        this.dialogRef.close({action: 'updated'});
      },
      (e) => {
        // rejected
        this.dialogRef.close({action: 'failed'});
      }
    );
  }
}
