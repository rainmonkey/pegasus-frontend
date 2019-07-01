import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  public baseUrl: any = environment.baseUrl;
  public subsOfStaffs;
  public subsOfTeachers;
  public subsOfStudents;
  public errorFlag: boolean = false;

  constructor(private http: HttpClient) { }

  getChattingList(userId) {
    this.http.get(this.baseUrl + 'Chat/GetStaffChattingList/' + userId).subscribe(
      (res) => {
        this.subsOfStaffs = res['Data'].Item1;
        this.subsOfTeachers = res['Data'].Item2;
        this.subsOfStudents = res['Data'].Item3;
        console.log(this.subsOfStaffs)
      },
      (err) => {
        this.errorFlag = true;
      }
    )
  }
}
