import { NgbootstraptableService } from '../../../../../services/others/ngbootstraptable.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesService } from 'src/app/services/http/courses.service';
import { CourseClassDetailModalComponent } from '../course-class-detail-modal/course-class-detail-modal.component';
import { CourseDeleteModalComponent } from '../course-delete-modal/course-delete-modal.component';

@Component({
  selector: 'app-course-class-list',
  templateUrl: './course-class-list.component.html',
  styleUrls: ['./course-class-list.component.css']
})
export class CourseClassListComponent implements OnInit {
  //what columns showed in the info page, can get from back-end in the future. must as same as database
  public columnsToShow: Array<string> = ['Course Name', 'Tutor', 'Start & End Dates', 'Location', 'Room', 'Time', ];

  public queryParams: object = {};
  public currentPage: number = 1;
  public pageSize: number = 10;


  errorMessage:string;
  @ViewChild('pagination') pagination;


  constructor(
    private courseService: CoursesService,
    private ngTable: NgbootstraptableService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getDataService();
  }

  getDataService(){
    this.courseService.getCourseClasses().subscribe(
      (res)=>{
        console.log(res.Data);
        this.routerControl();
      },
      (err)=>{
        this.processError(err);
      }
    )
  }

  processError(err) {
    console.warn(err)
    if (err.error) {
      if(err.error.ErrorMessage){
        this.errorMessage = err.error.ErrorMessage;
      } else {
        this.errorMessage = 'Sorry, something went wrong';
      }
    } else {
      this.errorMessage = 'Sorry, something went wrong';
    }
  }

  routerControl(){

  }

  getCurrentPage(){
    let currentPage = this.pagination.page;
    this.setQueryParams('currentPage',currentPage)
  }

  setQueryParams(paraName, paraValue) {

    if (paraValue == '') {
      delete this.queryParams[paraName];
      delete this.queryParams['searchBy'];
    }
    else {
      this.queryParams[paraName] = paraValue;
    }
  
    this.router.navigate(['courses/class/list'], {
      queryParams: this.queryParams
    });
  }
  











    
    /*
      update modal
    */
  updateModal(command, whichTeacher) {
    const modalRef = this.modalService.open(CourseClassDetailModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then(
      (res)=>{console.log(res), that.ngOnInit()
      }
    )
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  /*
    delete modal
  */
  deleteModal(command, whichTeacher) {
    const modalRef = this.modalService.open(CourseDeleteModalComponent);
    let that = this;
    modalRef.result.then(function(){
      that.ngOnInit()
    })
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  /*
    detail modal
  */
  detailModal(command, whichTeacher) {
    const modalRef = this.modalService.open(CourseClassDetailModalComponent, { size: 'lg' });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

}
