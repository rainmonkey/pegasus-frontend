import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private baseUrl: any = environment.baseUrl;

  constructor(private http:HttpClient) { }
  getOrgs() {
    return this.http.get(this.baseUrl + 'orgs');
  }

  getCourses():any{
    return this.http.get(this.baseUrl +'courses');
  }

  addNew(data):any{
    return this.http.post(this.baseUrl + 'courses',data)
  }

  update(data,courseId):any{
    return this.http.put(this.baseUrl + 'courses/'+ courseId, data)
  }

  deleteCourse(courseId):any{
    return this.http.delete(this.baseUrl + 'courses/' + courseId);
  }
  /* For dropdown options*/
  getCourseCategories():any{
    return this.http.get(this.baseUrl + 'coursecategories');
  }
  getTeacherLevel():any{
    return this.http.get(this.baseUrl + 'Lookups/1');
  }
  getLevel():any{
    return this.http.get(this.baseUrl + 'Lookups/4');
  }
  getCourseType():any{
    return this.http.get(this.baseUrl + 'Lookups/6');
  }
  getDuration():any{
    return this.http.get(this.baseUrl + 'Lookups/8');
  }
  /*-----------------------Course Class-----------------------------------*/
  getCourseClasses(){
    return this.http.get(this.baseUrl +'GroupCourseInstance');
  }
  addNewCourseClass(data):any{
    return this.http.post(this.baseUrl + 'GroupCourseInstance',data)
  }

  updateCourseClass(data,GroupCourseInstanceId):any{
    return this.http.put(this.baseUrl + 'GroupCourseInstance/'+ GroupCourseInstanceId, data)
  }

  deleteCourseClass(GroupCourseInstanceId):any{
    return this.http.delete(this.baseUrl + 'GroupCourseInstance/' + GroupCourseInstanceId);
  }  
  /* For dropdown options*/
  getCourseNames():any{
    return this.http.get(this.baseUrl + 'courses');
  }
  getTeachers():any{
    return this.http.get(this.baseUrl + 'teacher');
  }
  getLocations():any{
    return this.http.get(this.baseUrl + 'orgs');
  }
  getRooms():any{
    return this.http.get(this.baseUrl + 'room');
  }


  getoioi():any{
    return this.http.get(this.baseUrl+'payment');
  }
  postoioi(TermId):any{
    return this.http.post(this.baseUrl + 'payment/'+ TermId, '')
  }
}
