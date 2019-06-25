import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { CoursesService } from 'src/app/services/http/courses.service';
import { forkJoin } from 'rxjs'; //卧槽他妈的成功了！ rxjs 6 直接import forkJoin就行 不用再import Observable
import { TeachersService } from 'src/app/services/http/teachers.service';
import { NgbModal, NgbModalRef, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { TrialModalComponent } from '../trial-modal/trial-modal.component';
import { LearnersService } from 'src/app/services/http/learners.service';

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
  public popUpFlag: boolean = false;
  public LearnerId;
  public learners;
  public lastRouteName: string
  public arrangeUrl;

  @Input() childEvent;

  constructor(private coursesService: CoursesService,
    private teachersService: TeachersService,
    private modalService: NgbModal,
    private routerInfo: ActivatedRoute,
    private learnersService: LearnersService,
    private router: Router) { }

  ngOnInit() {
    this.getDataFromServer();
    this.LearnerId = this.routerInfo.snapshot.queryParams.LearnerId;
  }

  onClick() {
    this.lastRouteName = this.routerInfo.snapshot.routeConfig.path
    this.arrangeUrl = "/learner/credit/" + this.LearnerId
    if (this.lastRouteName == "trial") {
      this.router.navigateByUrl("/learner/list")
    } else if (this.lastRouteName == "arrange") {
      this.router.navigateByUrl(this.arrangeUrl)
    }
  }

  //并发获取所有数据
  getDataFromServer() {
    let coursesService = this.coursesService.getCourses();
    let coursesCategories = this.coursesService.getCourseCategories();
    let orgsService = this.coursesService.getLocations();
    let teachersService = this.teachersService.getTeachersInfo();
    let groupCourseInstance = this.coursesService.getCourseClasses();
    let teachingCourseService = this.teachersService.getTeachingCourse();
    let learnersService = this.learnersService.getLearnerList();

    forkJoin([coursesService, coursesCategories, orgsService, teachersService, groupCourseInstance, teachingCourseService, learnersService]).subscribe(
      (res) => {
        this.courses = res[0]['Data'];
        this.coursesCate = res[1]['Data'];
        this.orgs = res[2]['Data'];
        this.teachers = res[3]['Data'];
        this.groupCoursesInstance = res[4]['Data'];
        this.teachingCourses = res[5]['Data'];
        this.learners = res[6]['Data'];
      },
      (err) => {
        alert('Sorry, something went wrong.')
      }
    );
  }
}
