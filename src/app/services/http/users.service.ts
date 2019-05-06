import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  httpHeaders: HttpHeaders;
  token:string

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {
   }

  // API Request headers
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    return this.httpHeaders = new HttpHeaders({'Authorization': "Bearer "+ localStorage.getItem('Token')});
  }

  // Call API for sidebar Data
  getSidebar(){
    this.prepareHeaders()
    return this.http.get(this.baseUrl + 'navitems/', {headers: this.httpHeaders})
  }


}