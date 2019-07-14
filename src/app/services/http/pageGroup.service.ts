import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PageGroupService {
  baseUrl: any = environment.baseUrl;

constructor( private http:HttpClient) { }

getPageGroup():any{
  return this.http.get(this.baseUrl + 'pageGroup');
}





deletePageGroup(PageGroupId):any{
  return this.http.delete(this.baseUrl + 'pageGroup/' + PageGroupId);
}

 addNewPageGroup(data):any{
   return this.http.post(this.baseUrl +'pageGroup',data)
 }

updatePageGroup(data,PageGroupId):any{
  return this.http.put(this.baseUrl + 'pageGroup/' + PageGroupId, data)
}

}
