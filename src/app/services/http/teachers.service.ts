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

  getTeachersInfo():any{
    return this.http.get(this.baseUrl + 'teacher');
  }

  deleteTeacher(teacherId):any{
    return this.http.delete(this.baseUrl + 'teacher/' + teacherId);
  }

  getDropdownOptions():any{
    return this.http.get(this.baseUrl + 'qualificationslanguagesorgs');
  }
}
