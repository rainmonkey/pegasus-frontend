import { Component, OnInit, Input } from '@angular/core';
import { CoursesService } from 'src/app/services/http/courses.service';
import { forkJoin } from 'rxjs'; //卧槽他妈的成功了！ rxjs 6 直接import forkJoin就行 不用再import Observable
import { TeachersService } from 'src/app/services/http/teachers.service';

@Component({
  selector: 'app-trial-info',
  templateUrl: './trial-info.component.html',
  styleUrls: ['./trial-info.component.css',
              '../../teachers/teacher-panel/teacher-panel.component.css']
})
export class TrialInfoComponent implements OnInit {
  public courses;
  public coursesCate;
  public orgs;
  public teachers;
  public groupCoursesInstance;

  @Input() childEvent;
  
  constructor(private coursesService: CoursesService,
              private teachersService: TeachersService) { }

  ngOnInit() {
    this.getDataFromServer();
  }

  ngDoCheck(){
    if(this.childEvent !== undefined){
      console.log('emmmm')
      console.log('emmmm')
      console.log(this.childEvent)
    }
  }

  //并发获取所有数据
  getDataFromServer() {
    let coursesService = this.coursesService.getCourseClasses();
    let coursesCategories = this.coursesService.getCourseCategories();
    let orgsService = this.coursesService.getLocations();
    let teachersService = this.teachersService.getTeachersInfo();
    let groupCourseInstance = this.coursesService.getCourseClasses();

    forkJoin([coursesService, coursesCategories,orgsService,teachersService,groupCourseInstance]).subscribe(
      (res) => {
        this.courses = res[0]['Data'];
        this.coursesCate = res[1]['Data'];
        this.orgs = res[2]['Data'];
        this.teachers = res[3]['Data'];
        this.groupCoursesInstance = res[4]['Data'];
      },
      (err) => {
        alert('Sorry, something went wrong.')
      }
    );
  }
}
