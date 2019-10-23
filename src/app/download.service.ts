import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';

import { Patron } from './patron';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private readonly http: HttpClient) {}

  getPatronDB() {
    return this.http.post<Patron[]>('https://bleatcoin-coins.herokuapp.com/api/allPatrons', {});
  }
}
