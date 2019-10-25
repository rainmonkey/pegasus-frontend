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
  getCashBox(date) {
    let orgId =  localStorage.getItem('OrgId')[1];
    return this.http.get(this.baseUrl+'CashBox/' +orgId+ '/'+date);
  }
  submitCashBox(cashOut,date){
    let orgId =  localStorage.getItem('OrgId')[1];
    let staffId =  localStorage.getItem('staffId');
    return this.http.post(this.baseUrl+'CashBox/'+orgId+'/'+staffId+'/'+cashOut+ '/'+date,null);
  }
}
