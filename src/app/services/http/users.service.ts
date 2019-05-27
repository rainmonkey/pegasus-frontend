import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  httpHeaders: HttpHeaders;
  token:string

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {
    this.prepareHeaders()
  }

  // API Request headers
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    return this.httpHeaders = new HttpHeaders({'Authorization': "Bearer "+ localStorage.getItem('Token')})
  }

  // Call API for sidebar Data
  getSidebar(){
    return this.http.get(this.baseUrl + 'navitems', {headers: this.httpHeaders})
  }

  // Get users to do list
  getToDoList(){
    return this.http.get(this.baseUrl + 'todolist/' + localStorage.getItem('userID'), {headers:this.httpHeaders})
  }

  updateToDoList(taskID){
    return this.http.put(this.baseUrl + 'todolist/achieve/' + taskID, {headers:this.httpHeaders})
  }

  getLookUpData(){
    return this.http.get(this.baseUrl + 'lookups', {headers:this.httpHeaders})
  }
}