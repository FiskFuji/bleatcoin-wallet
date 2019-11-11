import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { LogEntry, LogType } from '../logentry';

@Component({
  selector: 'app-add-log-dialog',
  templateUrl: './add-log-dialog.component.html',
  styleUrls: ['./add-log-dialog.component.scss'],
  providers: [DatePipe]
})

export class AddLogDialogComponent implements OnInit {
  logTypes: string[] = [LogType.order, LogType.fin, LogType.misc];
  selectedAction: string = this.logTypes[0];
  infoControl: FormControl;

  constructor(private dialogRef: MatDialogRef<AddLogDialogComponent>, public datePipe: DatePipe) {
    this.infoControl = new FormControl(undefined, [
      Validators.required,
      Validators.maxLength(200),
    ]);
  }

  ngOnInit() {
  }

  generateDateString(): string {
    const LOGTIME = Date();
    const format = 'yyyy-MM-dd HH:mm:ss';

    return this.datePipe.transform(LOGTIME, format);
  }

  close() {
    this.dialogRef.close({hasLog: false});
  }

  closeWithLog() {
    const l: LogEntry = {
      date: this.generateDateString(),
      action: this.selectedAction,
      info: this.infoControl.value
    };

    this.dialogRef.close({
      hasLog: true,
      log: l
    });
  }
}
