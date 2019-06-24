import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminpaymentlistService {
  private baseUrl: any = environment.baseUrl;
  constructor(private http: HttpClient) { }

  /* For dropdown options*/
  getPaymentViews(beginDate, endDate) {
    return this.http.get(this.baseUrl + 'PaymentView/paymentBetweenDesc/' + beginDate + "&" + endDate);
  }
}
