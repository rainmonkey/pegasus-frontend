import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StaffListService {
  baseUrl: any = environment.baseUrl;
  httpHeaders: HttpHeaders;
  token:string
constructor( private http:HttpClient) { }

getStaffInfo():any{
  return this.http.get(this.baseUrl + '');
}

deleteStaff(staffId):any{
  return this.http.delete(this.baseUrl + '' + staffId);
}
}
