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

  //payment
  // getLearners(name): Observable<any[]>{
  //   return this._http.get<any[]>(this.urlLocal + 'learner/' + name);
  // }
  // getInvoice(id): Observable<any[]>{
  //   return this._http.get<any[]>(this.urlLocal + 'payment/invoice/' + id)
  // }
  // addFund(fund){
  //   return this._http.post(this.urlLocal + 'payment/payInvoice', fund, {responseType: 'text'});
  // }


}
