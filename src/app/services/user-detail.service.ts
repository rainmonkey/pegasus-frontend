import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { UserDetail } from '../models/UserDetail';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private baseUrl: any = environment.baseUrl;
  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) { }

  // getUserDetail(usrAndPass): Observable<any> {
  //   return this._http.post<UserDetail>(this.urlLocal, usrAndPass);
  // }
  // getAll() {
  //   return this._http.get<UserDetail[]>('login/');
  // }
  // getById(id: number) {
  //   return this._http.get('login/' + id);
  // }
}
