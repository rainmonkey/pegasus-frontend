import { Component, OnInit } from '@angular/core';
import { StaffListService } from 'src/app/services/http/staff-list.service';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { LookUpsService } from 'src/app/services/http/look-ups.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StaffDeleteModalComponent } from '../staff-delete-modal/staff-delete-modal.component';
import { StaffDetailModalComponent } from '../staff-detail-modal/staff-detail-modal.component';
import { StaffEditModalComponent } from '../staff-edit-modal/staff-edit-modal.component';

@Component({
  selector: 'app-Staff-list',
  templateUrl: './Staff-list.component.html',
  styleUrls: ['./Staff-list.component.css']
})
export class StaffListComponent implements OnInit {

 //what columns showed in the info page, can get from back-end in the future. must as same as database
 public columnsToShow: Array<string> = ['FirstName', 'LastName', 'Email', 'MobilePhone'];
 //staffs data from database
 public staffList: Array<any>;
 //staffs list copy. Using in searching method, in order to initialize data to original
 public staffListCopy: Array<any>;
  //how many datas in staffList
  public staffListLength: number;
  public queryParams: object = {};
  public currentPage: number = 1;
  public pageSize: number = 10;
  //loading
  public loadingFlag: boolean = false;
  public level: Array<any> = [];
  public duration: Array<any> = [];


 constructor(
   private staffService: StaffListService,
   private ngTable: NgbootstraptableService,
   private modalService: NgbModal,
   private router: Router,

 ) { }

 ngOnInit() {
   this.loadingFlag = true;
   this.getDataFromServer();
 }

 getDataFromServer(){
   this.staffService.getStaffInfo().subscribe(
     (res) => {
       this.staffList = res.Data;
       this.staffListCopy = this.staffList;
       this.staffListLength = res.Data.length;
       this.loadingFlag = false;
       console.log(this.staffList)
     },
     (err) => {
       alert("Thers's something wrong in server, please try later.")
     }
   )
 }


 /*
   sort method
 */
onSort(orderBy) {
 let orderControl = this.ngTable.sorting(this.staffList, orderBy);

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

   this.staffList = this.ngTable.searching(this.staffListCopy, searchBy, searchString);
   this.staffListLength = this.staffList.length;
   optionsObj['value'] = searchBy;
 }
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
   Insert space before capital letter.
     eg: FirstName --> First Name
 */
AddSpaceInString(strToAdd) {
 return strToAdd.replace(/(?=[A-Z])/g, ' ');
}




/*
 delete modal
*/
deleteModal(command, whichStaff) {
 const modalRef = this.modalService.open(StaffDeleteModalComponent);
 let that = this;
 modalRef.result.then(
   (res) => {
       that.ngOnInit()
   },
   (err) =>{
     return
   }
 )
 modalRef.componentInstance.command = command;
 modalRef.componentInstance.whichStaff = whichStaff;
}

/*
 detail modal
*/
detailModal(command, whichStaff) {
 const modalRef = this.modalService.open(StaffDetailModalComponent, { size: 'lg' });
 modalRef.componentInstance.command = command;
 modalRef.componentInstance.whichStaff = whichStaff;

}

updateModal(command, whichStaff) {
 const modalRef = this.modalService.open(StaffEditModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
 modalRef.componentInstance.command = command;
 modalRef.componentInstance.whichStaff = whichStaff;
 // modalRef.componentInstance.refreshFlag.subscribe(
 //   (res) => {
 //     modalRef.result.then(
 //       function () {
 //         if (res == true) {
 //           that.ngOnInit();
 //         }
 //       },
 //       function () {
 //         return;
 //       })
 //   }
 // )
}
}

