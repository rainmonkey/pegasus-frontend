import { Component, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbootstraptableService } from '../../../../../services/others/ngbootstraptable.service';

import { CoursesService } from 'src/app/services/http/courses.service';
import { CourseClassDetailModalComponent } from '../course-class-detail-modal/course-class-detail-modal.component';
import { CourseDeleteModalComponent } from '../course-delete-modal/course-delete-modal.component';

@Component({
  selector: 'app-course-class-list',
  templateUrl: './course-class-list.component.html',
  styleUrls: ['./course-class-list.component.css'],
  providers: [DecimalPipe]
})
export class CourseClassListComponent implements OnInit {
  public courseClassLists: any;
  public coursesClassListLength: number;
  public closeResult: string;  
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;
  public currentPage: number = 1;
  public coursesListCopy: Array<any>;
  public errorMessage: string;
    //search by which columns, determine by users
  public queryParams: object = {};
  public filter = new FormControl('');
  
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

  getDataService() {
    this.courseService.getCourseClasses().subscribe(
      (res) => {
        this.courseClassLists = res['Data'];
        this.courseClassLists.forEach(element => {
          element.CourseName = element.Course.CourseName;
          element.OrgId = element.Org.OrgId;
          element.OrgName = element.Org.OrgName;
          element.RoomId = element.Room.RoomId;
          element.RoomName = element.Room.RoomName;
          element.TeacherId = element.Teacher.TeacherId;
          element.TeacherName = element.Teacher.FirstName + ' ' + element.Teacher.LastName;
        });
        this.coursesListCopy = this.courseClassLists;
        this.coursesClassListLength = res['Data'].length; //length prop is under Data prop
        this.refreshPageControl();
        console.log(this.courseClassLists);
      },
      (err) => {
        this.backendErrorHandler(err);
      }
    )
  }

  backendErrorHandler(err) {
    console.warn(err)
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = "Error! Can't catch Data."
    }
  }


  /*
    set the default params when after page refresh
  */
  refreshPageControl() {
    this.activatedRoute.queryParams.subscribe(res => {
      let { searchString, searchBy, orderBy, orderControl, currentPage } = res;
      if (searchString !== undefined && searchBy !== undefined) {
        this.onSearch(null, { 'searchString': searchString, 'searchBy': searchBy })
      }
      if (orderBy !== undefined && orderControl !== undefined) {
        this.onSort(orderBy, orderControl)
      }
      if (currentPage !== undefined) {
        this.currentPage = currentPage;
      }
    })
    return;
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
    this.router.navigate(['courses/class/list'], {
      queryParams: this.queryParams
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getCurrentPage() {
    let currentPage = this.pagination.page;
    this.setQueryParams('currentPage', currentPage)
  }

  /*
  update modal
*/
  detailModal(command, whichCourseClass) {
    const modalRef = this.modalService.open(CourseClassDetailModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      that.ngOnInit();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichCourseClass = whichCourseClass;
  }


  /*
    delete modal
  */
  deleteModal(command, whichCourseClass) {
    const modalRef = this.modalService.open(CourseDeleteModalComponent);
    let that = this;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      that.ngOnInit()
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichCourseClass = whichCourseClass;
  }

  /*
    sort method
  */
  onSort(orderBy, orderControls?) {
    let orderControl = this.ngTable.sorting(this.courseClassLists, orderBy, orderControls);
    this.setQueryParams('orderBy', orderBy);
    this.setQueryParams('orderControl', orderControl);
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

      (initValue == undefined) ? { searchString, searchBy } =
        { searchString: searchingInputObj['value'], searchBy: 'CourseName' } :
        { searchString, searchBy } = initValue;

      this.courseClassLists = this.ngTable.searching(this.coursesListCopy, searchBy, searchString);
      this.coursesClassListLength = this.courseClassLists.length;

      this.setQueryParams('searchBy', searchBy);
      this.setQueryParams('searchString', searchString);
    } 

  }

}
