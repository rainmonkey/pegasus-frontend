import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  httpHeaders: HttpHeaders;
  token: string;

  private baseUrl: any = environment.baseUrl;
  constructor(private http: HttpClient) { }
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    this.httpHeaders = new HttpHeaders({'Authorization': ""+ localStorage.getItem('Token')})
  }

  getPayroll(begindate, enddate) {
    return this.http.get<any>(this.baseUrl + 'payroll/' + begindate + '/' + enddate);
  }

  getTeacherTransaction(teacherId, begindate, enddate) {
    return this.http.get<any>(this.baseUrl + 'teachertransaction/' + teacherId + '/' + begindate + '/' + enddate);
  }
}
