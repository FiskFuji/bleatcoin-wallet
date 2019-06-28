import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Patron } from './patron';

@Injectable()
export class PatronService {
  constructor(private http: HttpClient) {
  }

  getPatronsList() {
    return this.http.post<Patron[]>('https://bleatcoin-coins.herokuapp.com/api/allPatrons', {});
  }

  addPatron(patron: Patron[]): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const URL = 'https://bleatcoin-coins.herokuapp.com/api/create';
    const body = patron;

    const patronCreatedPromise = new Promise<string>((resolve, reject) => {
      this.http.post(URL, body, {headers: headers})
        .toPromise()
        .then(
          res => {
            // success
            resolve('New patron created successfully.');
          },
          msg => {
            // error
            reject(msg);
          }
        );
      });

    return patronCreatedPromise;
  }

  updatePatron(patron: Patron): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const ID = patron.id;
    const URL = 'https://bleatcoin-coins.herokuapp.com/api/update/' + ID;
    const body = patron;

    const patronUpdatedPromise = new Promise<string>((resolve) => {
      this.http.put(URL, body, {headers: headers})
        .toPromise()
        .then(
          res => {
            // success
            resolve('Patron updated successfully.');
          },
          msg => {
            // error
            resolve(msg);
          }
        );
    });

    return patronUpdatedPromise;
  }

  deletePatron(ID: number): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const URL = 'https://bleatcoin-coins.herokuapp.com/api/delete/' + ID;

    const patronDeletedPromise = new Promise<string>((resolve) => {
      this.http.delete(URL, {headers: headers})
        .toPromise()
        .then(
          res => {
            // success
            resolve('Patron deleted successfully.');
          },
          msg => {
            // error
            resolve(msg);
          }
        );
    });

    return patronDeletedPromise;
  }
}
