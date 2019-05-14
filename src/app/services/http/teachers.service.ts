import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  baseUrl: any = environment.baseUrl;
  httpHeaders: HttpHeaders;
  token:string

  constructor(
    private http:HttpClient
    ) {  }
  // API Request headers
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    return this.httpHeaders = new HttpHeaders({'Authorization': "Bearer "+ localStorage.getItem('Token')})
  }

  getTeachersInfo():any{
    return this.http.get(this.baseUrl + 'teacher');
  }

  deleteTeacher(teacherId):any{
    return this.http.delete(this.baseUrl + 'teacher/' + teacherId);
  }

  getDropdownOptions():any{
    return this.http.get(this.baseUrl + 'qualificationslanguagesorgs');
  }

  searching(searchString,columnToSearch):any{
    return this.http.get(this.baseUrl + 'teacher/' + searchString, columnToSearch) 
  }

  addNew(data):any{
    return this.http.post(this.baseUrl +'teacher',data)
  }

  update(data,teacherId):any{
    return this.http.put(this.baseUrl + 'teacher/' + teacherId, data)
  }
}
