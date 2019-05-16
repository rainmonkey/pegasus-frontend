import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { Router, ActivatedRoute } from '@angular/router';

import { CourseDetailModalComponent } from '../course-detail-modal/course-detail-modal.component';
import { CourseDeleteModalComponent } from '../course-delete-modal/course-delete-modal.component';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  public coursesList: any; 
  public coursesListLength: number;
  public temCoursesList: any; //save the original courseList
  public temCoursesListLength: number; //save the original courseList length
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;    //[can modify] pagination page size
  public coursesListCopy: Array<any>;
  //search by which columns, determine by users
  public queryParams: object = {};

  constructor(
    private coursesService: CoursesService, 
    private modalService: NgbModal, 
    private ngTable:NgbootstraptableService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getData();
  }

  /*
    get data form serve
  */
  getData() {
    this.coursesService.getCourses().subscribe(
      (res) => {
        this.coursesList = res.Data;
        this.coursesListCopy = this.coursesList;
        this.coursesListLength = res.Data.length; //length prop is under Data prop
        // console.log(this.coursesList);
        // console.log(res);
        this.refreshPageControl();
      },
      (error) => {this.errorProcess(error) })
  }

  errorProcess(error) {
  }

  refreshPageControl(){
    this.activatedRoute.queryParams.subscribe(res => {
      let {searchString,searchBy,orderBy,orderControl} = res;
      if(searchString !== undefined && searchBy !== undefined){
        this.onSearch(null, {'searchString':searchString,'searchBy':searchBy})
      }
      if(orderBy !==undefined && orderControl !== undefined){
        this.onSort(orderBy,orderControl)
      }
    })
  }


  /*
    items of queryParams:
      1, searchString
      2, searchBy
      3, orderBy
      4, orderControl
  */
  setQueryParams(paraName, paraValue) {
    if (paraValue == '') {
      delete this.queryParams[paraName];
      delete this.queryParams['searchBy'];
    }
    else {
      this.queryParams[paraName] = paraValue;
    }
    this.router.navigate(['tutors/list'], {
      queryParams: this.queryParams
    });
  }


  /*
    pop up modals, when need to pop up a modal, call this method
    commands:
      0 --> Add new
      1 --> Edit/update
      2 --> delete
  */
  popUpModals(command, whichCourse) {
    switch(command){
      case 0:
      case 2:
        this.detailModal(command,whichCourse);
        break;
      case 3:
        this.deleteModal(command,whichCourse);
        break;
    }
  }

  /*
    update modal
  */
  detailModal(command,whichCourse){
    const modalRef = this.modalService.open(CourseDetailModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then(function(){
      that.ngOnInit()
    })
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichCourse = whichCourse;
  }

  /*
    delete modal
  */
 deleteModal(command, whichCourse) {
  const modalRef = this.modalService.open(CourseDeleteModalComponent);
  let that = this;
  modalRef.result.then(function(){
    that.ngOnInit()
  })
  modalRef.componentInstance.command = command;
  modalRef.componentInstance.whichCourse = whichCourse;
}

  /*
    search method
  */
 onSearch(event, initValue?) {
  if (event !== null && !(event.type == 'keydown' && event.key == 'Enter')) {
    return;
  }
  else {
    let searchString: string;
    let searchBy: string;
    let searchingInputObj = document.getElementById('searchingInput');
    let optionsObj = document.getElementById('searchOption');

    (initValue == undefined) ? { searchString, searchBy } = { searchString: searchingInputObj['value'], searchBy: optionsObj['value'] } :
      { searchString, searchBy } = initValue;

    this.coursesList = this.ngTable.searching(this.coursesListCopy, searchBy, searchString);
    this.coursesListLength = this.coursesList.length;
    optionsObj['value'] = searchBy;

    this.setQueryParams('searchBy',searchBy);
    this.setQueryParams('searchString',searchString);
  }
}


  /*
    sort method
  */
 onSort(orderBy,orderControls?) {
  let orderControl = this.ngTable.sorting(this.coursesList, orderBy,orderControls);
  this.setQueryParams('orderBy',orderBy);
  this.setQueryParams('orderControl',orderControl);
}
}
