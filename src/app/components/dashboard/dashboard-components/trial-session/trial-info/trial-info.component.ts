import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { CoursesService } from 'src/app/services/http/courses.service';
import { forkJoin } from 'rxjs'; //卧槽他妈的成功了！ rxjs 6 直接import forkJoin就行 不用再import Observable
import { TeachersService } from 'src/app/services/http/teachers.service';
import { NgbModal, NgbModalRef, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { TrialModalComponent } from '../trial-modal/trial-modal.component';
import { TrialTesterComponent } from '../trial-tester/trial-tester.component';

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
  public teachingCourses;
  public popUpFlag:boolean = false;
  public LearnerId;

  @Input() childEvent;
  
  constructor(private coursesService: CoursesService,
              private teachersService: TeachersService,
              private modalService: NgbModal,
              private routerInfo:ActivatedRoute) { }

  ngOnInit() {
    this.getDataFromServer();
    this.LearnerId = this.routerInfo.snapshot.queryParams.LearnerId;
    //console.log(this.studentLevel)
  }

  //并发获取所有数据
  getDataFromServer() {
    let coursesService = this.coursesService.getCourses();
    let coursesCategories = this.coursesService.getCourseCategories();
    let orgsService = this.coursesService.getLocations();
    let teachersService = this.teachersService.getTeachersInfo();
    let groupCourseInstance = this.coursesService.getCourseClasses();
    let teachingCourseService = this.teachersService.getTeachingCourse();

    forkJoin([coursesService, coursesCategories,orgsService,teachersService,groupCourseInstance,teachingCourseService]).subscribe(
      (res) => {
        this.courses = res[0]['Data'];
        this.coursesCate = res[1]['Data'];
        this.orgs = res[2]['Data'];
        this.teachers = res[3]['Data'];
        this.groupCoursesInstance = res[4]['Data'];
        this.teachingCourses = res[5]['Data'];
      },
      (err) => {
        alert('Sorry, something went wrong.')
      }
    );
  }
}
