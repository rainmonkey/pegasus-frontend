import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

import { UserDetail } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  // private urlLocal: any = environment._url;
  // tslint:disable-next-line:variable-name
  private _url = 'http://45.76.123.59:5000/api/';
  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) {}

  // getUserDetail(usrAndPass): Observable<any> {
  //   return this._http.post<UserDetail>(this.urlLocal, usrAndPass);
  // }
  getAll() {
    return this._http.get<UserDetail[]>('login/');
  }
  // getById(id: number) {
  //   return this._http.get('login/' + id);
  // }

  getLearners(name): Observable<any[]> {
    return this._http.get<any[]>(this._url + 'learner/' + name);
  }
  getInvoice(id): Observable<any[]> {
    return this._http.get<any[]>(this._url + 'payment/invoice/' + id);
  }
  addFund(fund) {
    return this._http.post(this._url + 'payment/payInvoice', fund, { responseType: 'text'});
  }
  getProducts() {
    return this._http.get<any[]>(this._url + 'product/');
  }
  postPaymentService(payment) {
    return this._http.post(this._url + 'other/', payment);
  }
}
