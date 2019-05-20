import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { TransactionService } from '../../../../../services/http/transaction.service';
import { AdminInvoiceEditModalComponent } from '../admin-invoice-edit-modal/admin-invoice-edit-modal.component';


@Component({
  selector: 'app-admin-invoice-list',
  templateUrl: './admin-invoice-list.component.html',
  styleUrls: ['./admin-invoice-list.component.css']
})
export class AdminInvoiceListComponent implements OnInit {
  public queryParams: object = {};
  public learnerList: any;
  public learnerListLength: number;
  public temLearnerList: any; //save the original List
  public temLearnerListLength: number; //save the original List length
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;    //[can modify] pagination page size
  //error alert
  public errorMsg;
  public errorAlert = false;
  public errMsgM;
  public errMsgO;
  public staffId = 3;
  constructor(
    private modalService: NgbModal,
    private ngTable: NgbootstraptableService,
    // private learnersservice: LearnersService,
    private transactionService: TransactionService
    ) { }

  ngOnInit() {
    this.getData();
  }

  // modal method
  open(i){
    const modalRef = this.modalService.open(AdminInvoiceEditModalComponent, { size: 'lg' });
    let that = this;
    console.log(modalRef)
    //pass parameters to edit modals
    modalRef.componentInstance.item = i;
  }

  // get data from server side
  getData() {
    this.transactionService.getLearnerInvo(this.staffId).subscribe(
      (res) => {
        this.learnerList = res.Data;
        this.learnerListLength = res.Data.length; //length prop is under Data prop
        this.temLearnerList = res.Data;
        this.temLearnerListLength = res.Data.length;
        //this.learnerList[0].Learner.Parent.Email
      },
      error => {
        this.errorMsg = JSON.parse(error.error);
        console.log("Error!", this.errorMsg.ErrorMsg);
        this.errorAlert = false;
      });
  }

  // sort item
  onSort(orderBy, orderControls?) {
    let orderControl = this.ngTable.sorting(this.learnerList, orderBy, orderControls);
    this.setQueryParams('orderBy', orderBy);
    this.setQueryParams('orderControl',orderControl);
  }
  setQueryParams(paraName,paraValue) {
    if (paraValue == '') {
      delete this.queryParams[paraName];
      delete this.queryParams['searchBy'];
    }
    else {
      this.queryParams[paraName] = paraValue;
    }

    // this.router.navigate(['tutors/list'], {
    //   queryParams: this.queryParams
    // });
  }
  // search name
  onSearch(event){
    // should init original list and length
    this.learnerList = this.temLearnerList;
    this.learnerListLength = this.temLearnerListLength;

    let searchStr = event.target.value;
    //
    let titlesToSearch = 'FirstName';

    this.learnerList = this.ngTable.searching(this.learnerList,titlesToSearch,searchStr);
    this.learnerListLength = this.learnerList.length;
  }
}
