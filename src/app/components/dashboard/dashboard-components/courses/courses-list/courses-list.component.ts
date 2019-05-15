import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';

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

  constructor(private coursesService: CoursesService, private modalService: NgbModal, private ngTable:NgbootstraptableService) { }

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
        this.coursesListLength = res.Data.length; //length prop is under Data prop
        this.temCoursesList = res.Data;
        this.temCoursesListLength = res.Data.length;
        console.log(this.coursesList);
        // console.log(res);
      },
      (error) => {this.errorProcess(error) })
  }

  errorProcess(error) {
    // alert(error.message)
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
      case 1:
        this.detailModal(command,whichCourse);
        break;
      case 2:
        this.deleteModal(command,whichCourse);
        break;
    }
  }

  /*
    update modal
  */
  detailModal(command,whichCourse){
    //pop up modal
    const modalRef = this.modalService.open(CourseDetailModalComponent, { size: 'lg' });
    //bind this pointer to that
    let that = this;
    //refresh after save
    modalRef.result.then(function(){
      that.getData()
    });
    //pass parameters to pop up modals
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichCourse = whichCourse;
  }

  /*
    delete modal
  */
 deleteModal(command, whichCourse) {
  const modalRef = this.modalService.open(CourseDeleteModalComponent);
  let that = this;
  modalRef.result.then(that.refreshPage(that));
  modalRef.componentInstance.command = command;
  modalRef.componentInstance.whichCourseer = whichCourse;
}

  /*
    After data modified(delete,add,update), refresh the page
  */
refreshPage(pointer) {
  return function () {
    let refreshFlag, courseToDelete;
    [refreshFlag, courseToDelete] = pointer.refreshService.getRefreshRequest();
    if (refreshFlag == true) {
      //
      pointer.coursesList.forEach(function (current) {
        if (current.CourseId === courseToDelete) {
          pointer.coursesList.splice(pointer.coursesList.findIndex(i => i.CourseId === courseToDelete), 1)
          pointer.coursesListLength--;
        }
      })
    }
  }
}


  /*
    search method
  */
 /////////////////////////////////////////////////这个method要精简   -----------by Richard
  onSearch(event){
    //should init original list and length
    this.coursesList = this.temCoursesList;
    this.coursesListLength = this.temCoursesListLength;
    
    let searchStr = event.target.value;
    //
    let titlesToSearch = 'CourseName';

    this.coursesList = this.ngTable.searching(this.coursesList,titlesToSearch,searchStr);
    this.coursesListLength = this.coursesList.length;
  }


  /*
    sort method
  */
  onSort(orderBy) {
    this.ngTable.sorting(this.coursesList,orderBy);
  }
}
