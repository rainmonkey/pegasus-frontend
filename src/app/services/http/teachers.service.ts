import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  private baseUrl: any = environment.baseUrl;
  private url = 'http://192.168.178.76:5000/api/'

  constructor(private http:HttpClient) { 
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

  addNew(data):any{
    return this.http.post(this.baseUrl+'teacher',data)
  }
}
