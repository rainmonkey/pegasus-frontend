import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  baseUrl: any = environment.baseUrl;
  token:string
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.prepareHeaders()
  }

  // API Request headers
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    return this.httpHeaders = new HttpHeaders({'Authorization': "Bearer "+ localStorage.getItem('Token')})
  }

  getReceptionistRoom() {
    console.log(this.httpHeaders)
    return this.http.get<any>(this.baseUrl + 'room/forCalendar', {headers: this.httpHeaders});
  }

  getReceptionistLesson(date) {
    console.log(this.httpHeaders)
    return this.http.get<any>(this.baseUrl + 'lesson/' + date , {headers: this.httpHeaders});

  }

  getTeacherLesson() {
    console.log(this.httpHeaders);
    return this.http.get<any>('http://localhost:5000/api/lesson/user/1');
  }

}
