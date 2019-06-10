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
  return this.http.get(this.baseUrl + 'staff');
}

deleteStaff(StaffId):any{
  return this.http.delete(this.baseUrl + 'staff/' + StaffId);
}

addNew(data):any{
  return this.http.post(this.baseUrl +'staff',data)
}

update(data,StaffId):any{
  return this.http.put(this.baseUrl + 'staff/' + StaffId, data)
}
getStaffType():any{
  return this.http.get(this.baseUrl + 'Lookups/13')
}
getOrg():any{
  return this.http.get(this.baseUrl + 'orgs')
}
}
