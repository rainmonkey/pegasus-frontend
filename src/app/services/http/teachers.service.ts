import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  private baseUrl: any = environment.baseUrl;

  constructor(private http:HttpClient) { 
  }

  getTeachers():any{
    return this.http.get(this.baseUrl +'teacher');
  }

  getApis():any{
    return this.http.get(this.baseUrl + 'qualificationslanguagesorgs');
  }

  addNew(data):any{
    return this.http.post(this.baseUrl+'teacherregister',data)
  }
}
