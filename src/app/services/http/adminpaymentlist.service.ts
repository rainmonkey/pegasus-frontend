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
    return this.http.get(this.baseUrl + 'Payment/PaymentByDate/' + localStorage.getItem("staffId") + '/' + beginDate + '/' + endDate);
  }
  getPaymentMethod() {
    return this.http.get(this.baseUrl + 'lookups/7');
  }
  getPaymentType() {
    return this.http.get(this.baseUrl + 'lookups/14');
  }
  updateConfirm(paymentId, data):any{
    return this.http.put(this.baseUrl + 'Payment/' + paymentId + '/' + data, null);
  }
}
