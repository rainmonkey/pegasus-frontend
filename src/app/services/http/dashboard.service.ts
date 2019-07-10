import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl: any = environment.baseUrl;
constructor(private http:HttpClient) { }
// get recent registration data
getStatistic(brunchArray) {
  return this.http.get<any>(this.baseUrl + 'dashboard/'+ brunchArray);
}
}
