import { TeacherDetailModalComponent } from './../teacher-detail-modal/teacher-detail-modal.component';
import { TeacherUpdateModalComponent } from './../teacher-update-modal/teacher-update-modal.component';
import { NgbootstraptableService } from '../../../../../services/others/ngbootstraptable.service';
import { Component, OnInit } from '@angular/core';
import { TeachersService } from '../../../../../services/http/teachers.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TeacherDeleteModalComponent } from '../teacher-delete-modal/teacher-delete-modal.component';
import { stringify } from '@angular/core/src/render3/util';
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
  public teachersListLength: number; s
  //search by which columns, determine by users
  public queryParams: object = {};
  public columnsToSearch: Array<string> = [];
  public currentPage: number = 1;
  public pageSize: number = 10;

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
    //this.toggleLoadingGif('show')  'show' 'hide'
    this.toggleLoadingGif('show');
    this.teachersService.getTeachersInfo().subscribe(
      (res) => {
        this.teachersList = res.Data;
        this.teachersListCopy = this.teachersList;
        this.teachersListLength = res.Data.length;
        //console.log(this.teachersList)
        //this.toggleLoadingGif('show')  'show' 'hide'
        this.toggleLoadingGif('hide');
        this.refreshPageControl();
      },
      (err) => {
        //报错误信息
      }
    )
  }

  refreshPageControl(){
    this.activatedRoute.queryParams.subscribe(res => {
      let {searchString,searchBy,orderBy,orderControl} = res;
      if(searchString !==undefined && searchBy !==undefined){
        this.onSearch(null, {'searchString':searchString,'searchBy':searchBy})
      }
      if(orderBy !==undefined && orderControl !== undefined){
        this.onSort(orderBy,orderControl)
      }
    })
  }
  ///////////////////////////////////////////called by other methods//////////////////////////////////////////////

  toggleLoadingGif(command) {

  }



  ///////////////////////////////////////////called by template event/////////////////////////////////////////////
  /*
    Insert space before capital letter.
      eg: FirstName --> First Name 
  */
  AddSpaceInString(strToAdd) {
    return strToAdd.replace(/(?=[A-Z])/g, ' ');
  }

  /*
    let user decide in which column to search 
  */
  showSearchingSelection(event) {
    let dropDownObj = document.getElementById('t_info_search_by_btn');
    event.target.attributes.flag = !event.target.attributes.flag;

    if (event.target.attributes.flag == true) {
      let searchingInputObj = document.getElementById('searchingInput');
      searchingInputObj['value'] = null;
      dropDownObj.style.display = 'inline-block';
    }
    else {
      dropDownObj.style.display = 'none';
    }
  }

  /*
   let user decide in which column to search 
   handler of user's selection
 */
  showSelectStyle(event?) {
    event.target.attributes.flag = !event.target.attributes.flag;
    let attributes = event.target.attributes;
    if (attributes.flag == true) {
      //选中状态
      attributes.class.value = 't_selected'; //please keep class name as same as it in css file
      this.columnsToSearch.push(event.target.innerText);
    }
    else {
      //非选中状态
      attributes.class.value = '';
      this.columnsToSearch.splice(this.columnsToSearch.findIndex(i => i === event.target.innerText), 1)
    }
  }


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

  ///////////////////////////////////////handler of angular-bootstrap modals/////////////////////////////////////
  /*
    pop up modals, when need to pop up a modal, call this method
    commands:
      0 --> Add new
      1 --> show details/show more
      2 --> Edit/update
      3 --> delete
  */
  popUpModal(command, whichTeacher) {
    switch (command) {
      case 0:
        this.updateModal(command, whichTeacher);
        break;
      case 1:
        this.detailModal(command, whichTeacher)
        break;
      case 2:
        this.updateModal(command, whichTeacher);
        break;
      case 3:
        this.deleteModal(command, whichTeacher);
        break;
    }
  }

  /*
    update modal
  */
  updateModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TeacherUpdateModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then(function(){
      that.ngOnInit()
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
    const modalRef = this.modalService.open(TeacherDetailModalComponent, { size: 'lg' });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }
}
