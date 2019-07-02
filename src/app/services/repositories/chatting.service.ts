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
  public errorFlag: boolean;


  constructor(private http: HttpClient) { }

  //目前不同的权限调用的api不同 后台在改 到时候可以直接调用同一个api 后台进行判断 未完成
  getSubscribersList(userId) {
    this.http.get(this.baseUrl + 'Chat/GetStaffChattingList/' + userId).subscribe(
      (res) => {
        this.subsOfStaffs = res['Data'].Item1;
        this.subsOfTeachers = res['Data'].Item2;
        this.subsOfStudents = res['Data'].Item3;
        console.log(this.subsOfStaffs)
      },
      (err) => {
        console.log(err)
        this.errorFlag = true;
      }
    )
  }
}
