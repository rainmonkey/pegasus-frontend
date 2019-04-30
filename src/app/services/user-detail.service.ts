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
  private _url: string = 'http://45.76.123.59:5000/api/';
  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient) { }

  getUserDetail(usrAndPass): Observable<any> {
    return this._http.post<UserDetail>(this.urlLocal, usrAndPass);
  }

  getLearners(name): Observable<any[]>{
    return this._http.get<any[]>(this._url + 'learner/' + name);
  }
  getInvoice(id): Observable<any[]>{
    return this._http.get<any[]>(this._url + 'payment/invoice/' + id);
  }
  addFund(fund){
    return this._http.post(this._url + 'payment/payInvoice', fund, { responseType: 'text'});
  }
  getProdType(){
    return this._http.get<any[]>(this._url + 'product/getCat');
  }
  getProdCat(catId){
    return this._http.get<any[]>(this._url + 'product/gettypebycat/' + catId);
  }
  getProdName(typeId){
    return this._http.get(this._url + 'product/' + typeId);
  }

  postProdService(prod){
    return this._http.post(this._url + 'prod', prod);
  }

  postPaymentService(payment){
    return this._http.post(this._url + 'other', payment);
  }
}
