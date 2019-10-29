import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminPaymentProductModalComponent } from '../admin-payment-product-modal/admin-payment-product-modal.component';
import { AdminPaymentConfirmModalComponent } from '../admin-payment-confirm-modal/admin-payment-confirm-modal.component';
import { AdminpaymentlistService } from '../../../../../../services/http/adminpaymentlist.service';
import { NgbootstraptableService } from '../../../../../../services/others/ngbootstraptable.service';

@Component({
  selector: 'app-admin-payment-list',
  templateUrl: './admin-payment-list.component.html',
  styleUrls: ['./admin-payment-list.component.css']
})


export class AdminPaymentListComponent implements OnInit {
  //loading
  public loadingFlag: boolean = false;
  public searchbar: boolean = false;
  public adminPaymentList: any;
  public adminPaymentListLength: number;
  public adminPaymentListCopy: Array<any>;
  public closeResult: string;
  public paymentMethod: any;
  public paymentType: any;
  public searchForm: FormGroup;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;
  public inputBeginDate: NgbDateStruct;
  public inputEndDate: NgbDateStruct;
  //search by which columns, determine by users
  public queryParams: object = {};
  public searchPeriod:boolean= false;

  public paymentTotal:any;


  @ViewChild('pagination') pagination;

  constructor(
    private modalService: NgbModal,
    private adminpaymentlistService: AdminpaymentlistService,
    private fb: FormBuilder,
    private ngTable: NgbootstraptableService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    this.init();
    this.searchForm = this.fb.group(this.formGroupAssemble());
  }
  init(){
    this.paymentTotal={
      yesterdayChange:0,
      outCash:0,
      inCash: 0,
      bankDepoist: 0,
      eftpos: 0,
      cheque:0,
      totalChange:0,
      total:0
    };
  }
  formGroupAssemble() {
    let groupObj: any;
    let today = new Date();
    // let today =  new Date().getFullYear()+'-'+
    //   ("0"+(new Date().getMonth()+1)).slice(-2)+'-'+
    //   ("0"+new Date().getDate()).slice(-2);
      // console.log(today);
    let todayObj = { year: today.getFullYear(), 
        month: today.getMonth()+1, 
        day: today.getDate()};
    
    this.activatedRoute.queryParams.subscribe(
      (res) => {
        if (Object.keys(res).length === 0) {
          groupObj = {
            BeginDate: [todayObj, Validators.required],
            EndDate: [todayObj, Validators.required]
          }
        } else {
          let begindate = res.begindate.split("-").map((element) => { return parseInt(element) });
          let enddate = res.enddate.split("-").map((element) => { return parseInt(element) });
          this.inputBeginDate = { year: begindate[0], month: begindate[1], day: begindate[2] };
          this.inputEndDate = { year: enddate[0], month: enddate[1], day: enddate[2] };
          console.log(this.inputBeginDate);
          groupObj = {
            BeginDate: [this.inputBeginDate, Validators.required],
            EndDate: [this.inputEndDate, Validators.required]
          }
          this.loadingFlag = true;
          this.submitByMode(res.begindate, res.enddate);
          if (res.page !== undefined) {
            this.page = res.page;
            this.setQueryParams('page', this.page)
          }
        }
      }
    )
    return groupObj;
  }

  // click the search
  onSubmit() {
    let valueToSubmit = this.searchForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    let begin;
    if (vailadValue !== null) {
      if (this.searchPeriod ==true )
        begin = vailadValue.BeginDate.year + "-" + vailadValue.BeginDate.month + "-" + vailadValue.BeginDate.day;
      else
        begin = vailadValue.EndDate.year + "-" + vailadValue.EndDate.month + "-" + vailadValue.EndDate.day;
      let end = vailadValue.EndDate.year + "-" + vailadValue.EndDate.month + "-" + vailadValue.EndDate.day;
      const enddate = new NgbDate(vailadValue.EndDate.year, vailadValue.EndDate.month, vailadValue.EndDate.day)
      if (this.searchPeriod ==true && enddate.before(vailadValue.BeginDate)) {
        Swal.fire({
          title: 'End Date must be later than Begin Date!',
          type: 'error',
          showConfirmButton: true,
        });
        return;
      } else {
        this.loadingFlag = true;
        this.submitByMode(begin, end);
        this.setQueryParams('page', 1)
      }
    } else {
      Swal.fire({
        title: 'Please check your input!',
        type: 'error',
        showConfirmButton: true,
      });
    }
  }
  // check whether data vailad or not(ruled by Validators).
  checkInputVailad(valueSubmit) {
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    for (let i in this.searchForm.controls) {
      this.searchForm.controls[i].touched == true;
    }
    if (this.searchForm.status == 'VALID') {
      return valueSubmit;
    } else {
      this.loadingFlag = false;
      return null;
    }
  }
  // submit search
  submitByMode(begindate, enddate) {
    this.adminpaymentlistService.getPaymentMethod().subscribe(
      (res) => {
        this.paymentMethod = res['Data'];
      }
    )
    this.adminpaymentlistService.getPaymentType().subscribe(
      (res) => {
        this.paymentType = res['Data'];
      }
    )
    this.adminpaymentlistService.getPaymentViews(begindate, enddate).subscribe(
      (res) => {
        this.adminPaymentList = res['Data'];
        this.adminPaymentListCopy = this.adminPaymentList;
        this.adminPaymentListLength = res['Data'].length; //length prop is under Data prop
        this.loadingFlag = false;
        this.searchbar = true;
        this.init();
        this.getPaymentTotal(this.adminPaymentListCopy);
        this.adminPaymentList.forEach(element => {
          element.LearnerName = element.Learner.FirstName + " " + element.Learner.LastName;
          element.StaffName = element.Staff.FirstName + " " + element.Staff.LastName;
          for (let i = 0; i < this.paymentMethod.length; i++) {
            if (this.paymentMethod[i].PropValue == element.PaymentMethod) {
              element.PaymentMethodName = this.paymentMethod[i].PropName
            }
          }
          for (let i = 0; i < this.paymentType.length; i++) {
            if (this.paymentType[i].PropValue == element.PaymentType) {
              element.PaymentTypeName = this.paymentType[i].PropName
            }
          }
          if (element.Invoice != null) {
            element.CourseName = element.Invoice.CourseName;
            element.LessonQuantity = element.Invoice.LessonQuantity;
          }
          if (element.SoldTransaction.length != 0) {
            for (let i = 0; i < element.SoldTransaction.length; i++) {
              element.ProductName = element.SoldTransaction[i].Product.ProductName;
            }
          }
        });
      },
      (err) => {
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
        });
        console.log(err.error.ErrorMessage);
      }
    )
    this.getDaillyLog(begindate);
    this.setQueryParams('begindate', begindate);
    this.setQueryParams('enddate', enddate);
  }
  getDaillyLog(begindate){
    this.adminpaymentlistService.getCashBox(begindate).subscribe(
      (res) => {
        this.paymentTotal.yesterdayChange =  res['Data'];
        this.transChange();
      },
      (err) => {
        this.paymentTotal.yesterdayChange = 0;
      }
    )
  }
  getPaymentTotal(adminPaymentList){
    adminPaymentList.forEach(element => {
      this.paymentTotal.total += element.Amount; 
      if (element.PaymentMethod==1){
        this.paymentTotal.inCash+=element.Amount; 
      }
      else if(element.PaymentMethod==2){
        this.paymentTotal.eftpos+=element.Amount; 
      }
      else if(element.PaymentMethod==3){
        this.paymentTotal.bankDepoist+=element.Amount;         
      }      
    });
    this.transChange();
  }
  getCurrentPage() {
    this.page = this.pagination.page
    this.setQueryParams('page', this.page);
  }

  open(num, adminPaymentList) {
    // let that = this;
    // if (num == 0) {
    //   const modalRef = this.modalService.open(AdminPaymentProductModalComponent);
    //   modalRef.componentInstance.adminPaymentList = adminPaymentList;
    // }
    // else if (num == 1) {
    //   const modalRef = this.modalService.open(AdminPaymentConfirmModalComponent);
    //   modalRef.componentInstance.adminPaymentList = adminPaymentList;
    //   modalRef.componentInstance.refreshFlag.subscribe(
    //     (res) => {
    //       if (res == true) {
    //         that.ngOnInit();
    //       }
    //     }
    //   )
    // }
    return;
  }

  /*
    items of queryParams:
      1, searchString
      2, searchBy
      3, orderBy
      4, orderControl
  */
  /*
   sort method
 */
  onSort(orderBy, orderControls?) {
    let orderControl = this.ngTable.sorting(this.adminPaymentList, orderBy, orderControls);
    this.setQueryParams('orderBy', orderBy);
    this.setQueryParams('orderControl', orderControl);
  }
  setQueryParams(paraName, paraValue) {
    if (paraValue == '') {
      delete this.queryParams[paraName];
      delete this.queryParams['searchBy'];
    }
    else {
      this.queryParams[paraName] = paraValue;
    }
    this.router.navigate(['transaction/payments'], {
      queryParams: this.queryParams
    });
  }
  transChange(){
    this.paymentTotal.totalChange=this.paymentTotal.yesterdayChange;
    this.paymentTotal.totalChange += this.paymentTotal.inCash;
    this.paymentTotal.totalChange -= this.paymentTotal.outCash;
  }
  submitDaillyLog(){
    let vailadValue = this.searchForm.value;
    let begindate = vailadValue.EndDate.year + "-" + vailadValue.EndDate.month + "-" + vailadValue.EndDate.day;
    this.adminpaymentlistService.submitCashBox(this.paymentTotal.outCash,begindate).subscribe(
      (res) => {
       // this.paymentTotal.yesterdayChange =  res['Data'];
        this.transChange();
      },
      (err) => {
        let errMsg;
        if (err.error)
          errMsg =  err.error.ErrorMessage
        else
          errMsg = 'Error Occurred'
        Swal.fire({
          title: 'Oops',
          type: 'error',
          text: errMsg,
          showConfirmButton: true,
        });
      }
    )
  }
  // Searching
  onSearch(event, initValue?) {
    if (event !== null && !(event.type == 'keydown' && event.key == 'Enter')) {
      return;
    }
    else {
      let searchString: string;
      let searchBy: string;
      let searchingInputObj = document.getElementById('searchingInput');

      (initValue == undefined) ? { searchString, searchBy } =
        { searchString: searchingInputObj['value'], searchBy: 'LearnerName' } :
        { searchString, searchBy } = initValue;
      
      this.adminPaymentList = this.ngTable.searching(this.adminPaymentListCopy, searchBy, searchString);
      this.adminPaymentListLength = this.adminPaymentList.length;
    }
  }
}
