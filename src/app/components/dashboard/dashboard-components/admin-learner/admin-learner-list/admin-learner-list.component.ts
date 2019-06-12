import { Component, OnInit } from '@angular/core';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnersService } from 'src/app/services/http/learners.service';
import { LearnerDeleteModalComponent } from '../learner-delete-modal/learner-delete-modal.component';
import { LearnerDetailModalComponent } from '../learner-detail-modal/learner-detail-modal.component';
import { LearnerEditModalComponent } from '../learner-edit-modal/learner-edit-modal.component';
import { LearnerAddModalComponent } from '../learner-add-modal/learner-add-modal.component';

@Component({
  selector: 'app-admin-learner-list',
  templateUrl: './admin-learner-list.component.html',
  styleUrls: ['./admin-learner-list.component.css']
})
export class AdminLearnerListComponent implements OnInit {
  //what columns showed in the info page, can get from back-end in the future. must as same as database
  public columnsToShow: Array<string> = ['FirstName', 'LastName', 'ContactNum', 'Email'];

  //learners data from servers
  public learnerList: Array<any>;

  //learner list copy. Using in searching method, in order to initialize data to original
  public learnerListCopy: Array<any>;

  //how many datas in learnerList
  public learnerListLength: number;

  //errorMessage
  errorMessage: string;

  //search by which columns, determine by users
  public columnsToSearch: string;
  public currentPage: number = 1;
  public pageSize: number = 10;

  constructor(
    private LearnerListService: LearnersService,
    private ngTable: NgbootstraptableService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getDataFromServer()
  }


  //get data from server
  getDataFromServer() {
    this.LearnerListService.getLearnerList().subscribe(
      (res) => {
        console.log('a')
        console.log(res)
        //@ts-ignore
        this.learnerList = res.Data;
        //@ts-ignore
        this.learnerListCopy = this.learnerList;
        //@ts-ignore
        this.learnerListLength = res.Data.length;

      },
      (err) => {
        console.log('b')
        console.log(err); this.errorMessage = "Wrong"
      }
    )
  }

  /*
    sort method
  */
  onSort(orderBy) {
    let orderControl = this.ngTable.sorting(this.learnerList, orderBy);

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

      this.learnerList = this.ngTable.searching(this.learnerListCopy, searchBy, searchString);
      this.learnerListLength = this.learnerList.length;
      optionsObj['value'] = searchBy;
    }

  }

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


  ///////////////////////////////////////handler of angular-bootstrap modals/////////////////////////////////////
  /*
    pop up modals, when need to pop up a modal, call this method
    commands:
      0 --> Add new
      1 --> show details/show more
      2 --> Edit/update
      3 --> delete
  */
  popUpModal(command, whichLearner) {
    switch (command) {
      case 0:
        this.addModal(command, whichLearner)
        break;
      case 1:
        this.detailModal(command, whichLearner)
        break;
      case 2:
        this.EditModal(command, whichLearner)
        break;
      case 3:
        this.deleteModal(command, whichLearner);
        break;
    }
  }


  /*
    delete modal
  */
  deleteModal(command, whichLearner) {
    const modalRef = this.modalService.open(LearnerDeleteModalComponent);
    let that = this;
    modalRef.result.then(
      (res) => {
        that.ngOnInit()
      },
      (err) => {
        return
      }
    )
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichLearner = whichLearner;
  }

  /*
    detail modal
  */
  detailModal(command, whichLearner) {
    const modalRef = this.modalService.open(LearnerDetailModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichLearner = whichLearner;
  }
  /*
    Edit modal
  */
  EditModal(command, whichLearner) {
    const modalRef = this.modalService.open(LearnerEditModalComponent, { windowClass: 'my-class', backdrop: 'static', keyboard: false });

    let that = this;
    modalRef.result.then(
      (res) => {
        that.ngOnInit()
      },
      (err) => {
        return
      }
    )
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichLearner = whichLearner;
  }

  /*
    jump to another page
  */
  jumpToTrialCoursePage() {
    history.pushState(null, '', 'trial')
  }

  /*
    Add modal
  */
  addModal(command, whichLearner) {
    const modalRef = this.modalService.open(LearnerAddModalComponent, { windowClass: 'my-class', backdrop: 'static', keyboard: false });

    let that = this;
    modalRef.result.then(
      (res) => {
        that.ngOnInit()
      },
      (err) => {
        return
      }
    )
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichLearner = whichLearner;
  }
}
