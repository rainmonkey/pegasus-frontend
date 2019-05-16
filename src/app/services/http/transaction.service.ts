import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl: any = environment.baseUrl;
  private url = 'http://192.168.178.76:5000/api/';
constructor(private http: HttpClient) { }
  getLearnerInvo(staffId): any {
    return this.http.get(this.baseUrl + 'InvoiceWaitingConfirms/' + staffId);
  }
  update(data): any {
    return this.http.put(this.baseUrl + 'InvoiceWaitingConfirms/', data);
  }
}
