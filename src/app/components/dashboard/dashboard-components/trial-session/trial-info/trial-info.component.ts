import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/http/courses.service';
import { forkJoin } from 'rxjs'; //卧槽他妈的成功了！ rxjs 6 直接import forkJoin就行 不用再import Observable
import { TeachersService } from 'src/app/services/http/teachers.service';

@Component({
  selector: 'app-trial-info',
  templateUrl: './trial-info.component.html',
  styleUrls: ['./trial-info.component.css']
})
export class TrialInfoComponent implements OnInit {
  public courses;
  
  constructor(private coursesService: CoursesService,
    private teachersService: TeachersService) { }

  ngOnInit() {
    this.getDataFromServer();
  }

  //并发获取所有数据
  getDataFromServer() {
    let coursesService = this.coursesService.getCourseClasses();

    forkJoin([coursesService]).subscribe(
      (res) => {
        this.courses = res[0]['Data'];
      },
      (err) => {
        alert('Sorry, something went wrong.')
      }
    );
  }
}
