import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';

import { LogEntry, LogType } from '../logentry';

import { DeleteAllLogsDialogComponent } from '../delete-all-logs-dialog/delete-all-logs-dialog.component';
import { DeleteLogWarningDialogComponent } from '../delete-log-warning-dialog/delete-log-warning-dialog.component';

import { AuthService } from './../auth.service';
import { LoggingService } from '../logging.service';
import { CookieService } from 'ngx-cookie-service';
import { AddLogDialogComponent } from '../add-log-dialog/add-log-dialog.component';

@Component({
  selector: 'app-logging-view',
  templateUrl: './logging-view.component.html',
  styleUrls: ['./logging-view.component.scss'],
})

export class LoggingViewComponent implements OnInit {
  requestInProgress = true;
  LOG_ENTRY_THRESHOLD_WARNING = 3000;
  logs: LogEntry[] = [];
  copyOfLogs: LogEntry[] = [];
  filterOptions: string[] = [
    LogType.add, LogType.sub, LogType.batch, LogType.create, LogType.del, LogType.edit, LogType.order, LogType.fin
  ];
  selectedFilter: string;

  constructor(private snackBar: MatSnackBar, readonly dialog: MatDialog, private router: Router,
    private Log: LoggingService, private Auth: AuthService, private cookie: CookieService) {
      if (!this.Auth.isAuthed()) {
        this.router.navigateByUrl('/Admin');
      }

      this.Log.getLogs().subscribe(
        res => {
          res.reverse();
          this.logs = res;
          this.copyOfLogs = res;

          if (this.logs.length > this.LOG_ENTRY_THRESHOLD_WARNING) {
            this.snackBar.open(
              'Over' + this.LOG_ENTRY_THRESHOLD_WARNING + 'log entries. Database integrity may fall. Please delete unneeded entries.',
              'Dismiss',
              {duration: 5000}
            );
          }
        },
        e => {
          this.snackBar.open('Error loading logs. Please refresh page.', 'Dismiss', {duration: 6000});
        },
        () => {
          // finally
          this.requestInProgress = false;
        }
      );
  }

  ngOnInit() {
  }

  filterByCriterion() {
    const q = this.selectedFilter;
    this.logs = this.copyOfLogs;

    if (q === '' || q === undefined) {
      return;
    }

    this.logs = this.logs.filter((v, i, a) => {
      return (v.action.includes(q));
    });
  }

  deleteLog(index: number) {
    // was user warned about log deletion
    if (this.cookie.check('log-delete-warned')) {
      this.requestInProgress = true;
      this.Log.deleteLog(this.logs[index]).then(
        res => {
          this.logs.splice(index, 1);
          this.snackBar.open('Log entry deleted.', 'Dismiss', {duration: 2000});
          this.requestInProgress = false;
        },
        rej => {
          this.snackBar.open('Error occured while deleting log entry.', 'Dismiss', {duration: 2000});
          this.requestInProgress = false;
        }
      );
      return;
    }

    // if not, warn user.
    const dialogRef = this.dialog.open(DeleteLogWarningDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // cancel was clicked
      if (!result) {
        return;
      }

      this.cookie.set('log-delete-warned', 'true', 1);
      this.requestInProgress = true;
      this.Log.deleteLog(this.logs[index]).then(
        res => {
          this.logs.splice(index, 1);
          this.requestInProgress = false;
          this.snackBar.open('Log entry deleted.', 'Dismiss', {duration: 2000});
        },
        rej => {
          this.snackBar.open('Error occured while deleting log entry.', 'Dismiss', {duration: 2000});
          this.requestInProgress = false;
        }
      );
    });
  }

  openAddLogDialog() {
    const dialogRef = this.dialog.open(AddLogDialogComponent, {
      disableClose: true,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // if true, added log
      if (result.hasLog) {
        this.requestInProgress = true;

        const log: LogEntry = result.log;
        this.Log.createLog(log.date, log.action, log.info).then(
          res => {
            // put log at front of list
            this.logs.unshift(log);
            this.requestInProgress = false;
            this.snackBar.open('Manually added a log. Type: ' + log.action + '.', 'Dismiss', {duration: 3000});
          },
          rej => {
            this.requestInProgress = false;
            this.snackBar.open('Error occurred while creating log.', 'Dismiss', {duration: 2500});
          }
        )
      }
    });
  }

  openDeleteAllLogsDialog() {
    const dialogRef = this.dialog.open(DeleteAllLogsDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // if true, delete all
      if (result) {
        this.Log.deleteAllLogs().then(
          res => {
            this.requestInProgress = true;
            this.Log.getLogs().subscribe(
              ls => {
                ls.reverse();
                this.logs = ls;
                this.copyOfLogs = ls;

                this.snackBar.open('All logs deleted successfully.', 'Dismiss', {duration: 3000});
              },
              e => {
                // do nothing
              },
              () => {
                this.requestInProgress = false;
              }
            );
          },
          msg => {
            this.snackBar.open('An error occurred while attempting to delete all logs.', 'Dismiss', {duration: 3000});
          }
        );
      }
    });
  }
}
