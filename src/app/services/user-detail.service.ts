import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from '../models/UserDetail';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private urlLocal: any = environment._url;
  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) { }

  getUserDetail(usrAndPass): Observable<any> {
    return this._http.post<UserDetail>(this.urlLocal, usrAndPass);
  }
}
