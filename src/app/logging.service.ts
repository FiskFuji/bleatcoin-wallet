import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LogEntry } from './logentry';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(private readonly http: HttpClient) { }

  getLogs() {
    return this.http.get<LogEntry[]>('https://bleatcoin-logs.herokuapp.com/api/allLogs');
  }

  createLog(t: string, a: string, i: string): Promise<string> {
    const LOG = {
      date: t,
      action: a,
      info: i
    } as LogEntry;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const URL = 'https://bleatcoin-logs.herokuapp.com/api/create';
    const body = [LOG];

    const logEntryCreatedPromise = new Promise<string>((resolve, reject) => {
      this.http.post(URL, body, {headers: headers})
        .toPromise()
        .then(
          res => {
            // success
            resolve('Log entry created');
          },
          msg => {
            // failure
            reject(msg);
          }
        );
    });

    return logEntryCreatedPromise;
  }

  deleteLog(l: LogEntry): Promise<string> {
    const dateID = l.date;
    const URL = 'https://bleatcoin-logs.herokuapp.com/api/delete/' + dateID;

    const deleteLogPromise = new Promise<string>((resolve, reject) => {
      this.http.delete(URL)
        .toPromise()
        .then(
          res => {
            resolve('Log with date-stamp: ' + dateID + ' deleted.');
          },
          msg => {
            reject(msg);
          }
        );
    });

    return deleteLogPromise;
  }

  deleteAllLogs(): Promise<string> {
    const URL = 'https://bleatcoin-logs.herokuapp.com/api/delete/pleaseDeleteAllLogs';

    const deletedAllLogsPromise = new Promise<string>((resolve, reject) => {
      this.http.delete(URL)
        .toPromise()
        .then(
          res => {
            resolve('All logs deleted.');
          },
          msg => {
            reject(msg);
          }
        );
    });

    return deletedAllLogsPromise;
  }
}
