import { Component, OnInit } from '@angular/core';
import { PageGroupService } from 'src/app/services/http/pageGroup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { PageGroupEditComponent } from '../pageGroup-edit/pageGroup-edit.component';
import { PageGroupDeleteComponent } from '../pageGroup-delete/pageGroup-delete.component';
import { PageGroupListComponent } from '../pageGroup-list/pageGroup-list.component';
@Component({
  selector: 'app-pageGroup-details',
  templateUrl: './pageGroup-details.component.html',
  styleUrls: ['./pageGroup-details.component.css']
})
export class PageGroupDetailsComponent implements OnInit {
 //what columns showed in the info page, can get from back-end in the future. must as same as database
 public columnsToShow: Array<string> = [ 'PageGroupName','DisplayOrder','Icon'];
 //staffs data from database
 public pageGroup: Array<any>;
 //staffs list copy. Using in searching method, in order to initialize data to original
 public pageGroupCopy: Array<any>;
  //how many datas in staffList
  public pageGroupLength: number;
  public queryParams: object = {};
  public currentPage: number = 1;
  public pageSize: number = 10;
  //loading
  public loadingFlag: boolean = false;
  public level: Array<any> = [];
  public duration: Array<any> = [];
  2
  constructor(
   private pageGroupService:PageGroupService,
   private ngTable: NgbootstraptableService,
   private modalService: NgbModal,
   private router: Router,
  ) { }

  ngOnInit() {
    this.loadingFlag = true;
    this.getDataFromServer();
  }
  getDataFromServer(){
    this.pageGroupService.getPageGroup().subscribe(
      (res) => {
        this.pageGroup = res.Data;
        this.pageGroupCopy = this.pageGroup;
        this.pageGroupLength = res.Data.length;
        this.loadingFlag = false;   
        console.log(this.pageGroup)
      },
      (err) => {
        alert("Thers's something wrong in server, please try later.")
      }
    )
  }
  onSort(orderBy) {
    let orderControl = this.ngTable.sorting(this.pageGroup, orderBy);
   
   }
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
   
      this.pageGroup = this.ngTable.searching(this.pageGroupCopy, searchBy, searchString);
      this.pageGroupLength = this.pageGroup.length;
      optionsObj['value'] = searchBy;
    }
   }
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
   AddSpaceInString(strToAdd) {
    return strToAdd.replace(/(?=[A-Z])/g, '');
   }
   /*
 delete modal
*/
deleteModal(command, whichPageGroup) {
  const modalRefs = this.modalService.open(PageGroupDeleteComponent);
  let that = this;
  modalRefs.result.then(
    (res) => {
        that.ngOnInit()
    },
    (err) =>{
      return
    }
  )

  modalRefs.componentInstance.command = command;
  modalRefs.componentInstance.whichPageGroup = whichPageGroup;
 }
 
 /*
  detail modal
 */
 detailModal(command, whichPageGroup) {
  const modalRefs = this.modalService.open(PageGroupListComponent, { size: 'lg' });
  modalRefs.componentInstance.command = command;
  modalRefs.componentInstance.whichPageGroup = whichPageGroup;
 
 }

 
   updateModal(command, whichPageGroup) {
    const modalRefs = this.modalService.open(PageGroupEditComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    let that = this;
    modalRefs.componentInstance.command = command;
    modalRefs.componentInstance.whichPageGroup = whichPageGroup;
    modalRefs.componentInstance.refreshFlag.subscribe(
      (res) => {
        modalRefs.result.then(
          function () {
            if (res == true) {
              that.ngOnInit();
            }
          },
          function () {
            return;
          })
      }
    )
   }
}
