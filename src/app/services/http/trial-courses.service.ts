import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TrialCoursesService {

  baseUrl = environment.baseUrl;

  constructor(
    private http:HttpClient
  ) { }

  /**
   * Get courses taught by a teacher.
   * @param teacherId - teacher's ID
   */
  getTeacherCoursesbyId(teacherId:number){
    return this.http.get(this.baseUrl + 'lesson/GetLessonsTeacherId/' + teacherId);
  }
}
