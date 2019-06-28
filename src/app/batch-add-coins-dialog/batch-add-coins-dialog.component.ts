import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { PatronTiers } from '../patron';

@Component({
  selector: 'app-batch-add-coins-dialog',
  templateUrl: './batch-add-coins-dialog.component.html',
  styleUrls: ['./batch-add-coins-dialog.component.scss']
})

export class BatchAddCoinsDialogComponent implements OnInit {
  availableTiers: string[] = PatronTiers;
  selectedTier: string;
  coinsFormControl: FormControl;

  constructor(readonly dialogRef: MatDialogRef<BatchAddCoinsDialogComponent>) {
    this.selectedTier = this.availableTiers[0];
    this.coinsFormControl = new FormControl(0, [
      Validators.required,
      Validators.max(999999)
    ]);
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close({
      added: false,
      coins: 0,
      selectedTier: ''
    });
  }

  addCoins() {
    this.dialogRef.close({
      added: true,
      coins: this.coinsFormControl.value,
      selectedTier: this.selectedTier
    });
  }
}
