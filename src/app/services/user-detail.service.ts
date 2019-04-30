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


  getLearners(name): Observable<any[]> {
    return this._http.get<any[]>(this.baseUrl + 'learner/' + name);
  }
  getInvoice(id): Observable<any[]> {
    return this._http.get<any[]>(this.baseUrl + 'payment/invoice/' + id);
  }
  addFund(fund) {
    return this._http.post(this.baseUrl + 'payment/payInvoice', fund, { responseType: 'text' });
  }
  getProdType() {
    return this._http.get<any[]>(this.baseUrl + 'product/getCat');
  }
  getProdCat(catId) {
    return this._http.get<any[]>(this.baseUrl + 'product/gettypebycat/' + catId);
  }
  getProdName(typeId) {
    return this._http.get(this.baseUrl + 'product/' + typeId);
  }

  postProdService(prod) {
    return this._http.post(this.baseUrl + 'prod', prod);
  }

  postPaymentService(payment) {
    return this._http.post(this.baseUrl + 'other', payment);
  }
}