import { TeacherDetailModalComponent } from './../teacher-detail-modal/teacher-detail-modal.component';
import { TeacherUpdateModalComponent } from './../teacher-update-modal/teacher-update-modal.component';
import { NgbootstraptableService } from '../../../../../services/others/ngbootstraptable.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TeachersService } from '../../../../../services/http/teachers.service';
import { NgbModal, NgbModalRef, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { TeacherDeleteModalComponent } from '../teacher-delete-modal/teacher-delete-modal.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teacher-info',
  templateUrl: './teacher-info.component.html',
  styleUrls: ['./teacher-info.component.css']
})
export class TeacherInfoComponent implements OnInit {
  //what columns showed in the info page, can get from back-end in the future. must as same as database
  public columnsToShow: Array<string> = ['FirstName', 'LastName', 'Email'];
  //teachers data from database
  public teachersList: Array<any>;
  //teachers list copy. Using in searching method, in order to initialize data to original
  public teachersListCopy: Array<any>;
  //how many datas in teachersList
  public teachersListLength: number;
  public queryParams: object = {};
  public currentPage: number = 1;
  public pageSize: number = 10;

  @ViewChild('pagination') pagination;

  constructor(
    private teachersService: TeachersService,
    private ngTable: NgbootstraptableService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit():any {
    this.getDataFromSever();
  }

  /////////////////////////////////////////////////data handlers////////////////////////////////////////////////////
  /*
    get data from service
  */
  getDataFromSever() {
    this.teachersService.getTeachersInfo().subscribe(
      (res) => {
        this.teachersList = res.Data;
        this.teachersListCopy = this.teachersList;
        this.teachersListLength = res.Data.length;
        //console.log(this.teachersList)
      
        this.refreshPageControl(); 
       
      },
      (err) => {
        alert("Thers's something wrong in server, please try later.")
      }
    )
  }

  /*
    set the default params when after page refresh
  */
  refreshPageControl(){
    this.activatedRoute.queryParams.subscribe(res => {
      let {searchString,searchBy,orderBy,orderControl,currentPage} = res;
      if(searchString !==undefined && searchBy !==undefined){
        this.onSearch(null, {'searchString':searchString,'searchBy':searchBy})
      }
      if(orderBy !==undefined && orderControl !== undefined){
        this.onSort(orderBy,orderControl)
      }
      if(currentPage !== undefined){
        this.currentPage = currentPage;
      }
    })
    return;
  }
  ///////////////////////////////////////////called by other methods//////////////////////////////////////////////

  toggleLoadingGif(command) {

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

  ///////////////////////////////////////////called by template event/////////////////////////////////////////////
  /*
    sort method
  */
  onSort(orderBy,orderControls?) {
    let orderControl = this.ngTable.sorting(this.teachersList, orderBy,orderControls);
    this.setQueryParams('orderBy',orderBy);
    this.setQueryParams('orderControl',orderControl);
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

      this.teachersList = this.ngTable.searching(this.teachersListCopy, searchBy, searchString);
      this.teachersListLength = this.teachersList.length;
      optionsObj['value'] = searchBy;

      this.setQueryParams('searchBy',searchBy);
      this.setQueryParams('searchString',searchString);
    }

  }

  getCurrentPage(){
    let currentPage = this.pagination.page;
    this.setQueryParams('currentPage',currentPage)
  }

  ///////////////////////////////////////handler of angular-bootstrap modals/////////////////////////////////////
  
  /*
    update modal
  */
  updateModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TeacherUpdateModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then(
      function(){
        that.ngOnInit();
      },
      function(){
        that.ngOnInit();
    })
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  /*
    delete modal
  */
  deleteModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TeacherDeleteModalComponent);
    let that = this;
    modalRef.result.then(
      function(){
        that.ngOnInit();
      },
      function(){
        that.ngOnInit();
      })
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  /*
    detail modal
  */
  detailModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TeacherDetailModalComponent, { size: 'lg' });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }
}
