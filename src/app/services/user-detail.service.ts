import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from '../models/UserDetail';

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
<<<<<<< HEAD:src/app/user-detail.service.ts
=======

export class LearnersListService {
  // tslint:disable-next-line:variable-name
  private _url = 'http://192.168.178.76:5000/api/';

  constructor(private http: HttpClient) {}

  getLearners(name): Observable<any[] > {
    return this.http.get<any[]>(this._url + 'learner/' + name);
  }
  getInvoice(id): Observable<any[] > {
    return this.http.get<any[]>(this._url + 'payment/invoice/' + id);
  }
  addFund(fund) {
    return this.http.post(this._url + 'payment/payInvoice', fund, {responseType: 'text'});
  }

}
>>>>>>> 3117cf1aa4f23871a5e1bb30decedd3e2a15e023:src/app/services/user-detail.service.ts
