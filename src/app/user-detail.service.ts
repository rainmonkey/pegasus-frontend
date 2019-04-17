import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from './models/UserDetail';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  // tslint:disable-next-line:variable-name
  private _url = 'http://192.168.178.76:5000/api/getrole';
  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) { }

  getUserDetail(usrAndPass): Observable<any> {
    return this._http.post<UserDetail>(this._url, usrAndPass);
  }
}

