import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { TransactionService } from '../../../../../services/http/transaction.service';
import { AdminInvoiceEditModalComponent } from '../admin-invoice-edit-modal/admin-invoice-edit-modal.component';
import { CoursesService } from '../../../../../services/http/courses.service';
import * as jsPDF from 'jspdf';
import Swal from 'sweetalert2';

interface Learner {
  OwingFee: string | number;
  IsEmailSent: string | number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  IsUnder18: string;
}
@Component({
  selector: 'app-admin-invoice-list',
  templateUrl: './admin-invoice-list.component.html',
  styleUrls: ['./admin-invoice-list.component.css']
})
export class AdminInvoiceListComponent implements OnInit {
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
  public userId;
  isLoad: boolean = false;

  public isSearchingFlag: boolean = false
  // learner name and
  learner: Learner;
  terms: [];
  termId: number;
  myArray = [];
  //teachers list copy. Using in searching method, in order to initialize data to original
  public myArrayCopy: Array<any>;

  constructor(
    private modalService: NgbModal,
    private ngTable: NgbootstraptableService,
    private transactionService: TransactionService,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userID");
    this.getTerm();
    // setInterval(() => {
    //   console.log(this.myArray)
    // }, 2000)
  }

  clearSearch() {
    this.isSearchingFlag = false
    this.myArray = this.temLearnerList.map(data => data.Learner)
    this.learnerListLength = this.temLearnerListLength
  }

  // modal method
  open(item) {
    const modalRef = this.modalService.open(AdminInvoiceEditModalComponent,
      {
        size: 'lg', backdrop: "static", keyboard: false,
        // beforeDismiss: new Promise((resolve,reject)=>{
        //
        // })
      });
    //pass parameters to edit modals
    modalRef.result.then(result => {
      this.getData()
    }, reason => { })

    modalRef.componentInstance.item = item;
  }

  // get data from server side
  getData() {
    this.isLoad = true;
    this.transactionService.getLearnerInvo(this.userId, this.termId).subscribe(
      (res) => {
        this.learnerList = res.Data;
        this.learnerListLength = res.Data.length; //length prop is under Data prop
        this.temLearnerList = res.Data;
        this.temLearnerListLength = res.Data.length;
        this.isLoad = false;
        // setInterval(() => {
        //   console.log(res.Data)
        // }, 3000)
        // make array for sort
        this.makeArray();
      },
      error => {
        this.isLoad = false;
        this.errorMsg = JSON.parse(error.error);
        console.log("Error!", this.errorMsg.ErrorMsg);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.ErrorMessage,
        });
        this.errorAlert = false;
      });
  }

  onChange(value) {
    this.termId = +value;
  }

  onSubmit() {
    this.getData();
  }

  getTerm() {
    var today = new Date();
    this.coursesService.getoioi().subscribe(
      (res) => {
        this.terms = res.Data;
        for (let e of this.terms) {
          this.termId = e['TermId'];
          if ((today >= new Date(e['BeginDate'])) && (today <= new Date(e['EndDate'])))
            break;
        }
        this.getData()
      }, (error) => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.ErrorMessage,
        });
      }
    )
  }

  // push to array for sort
  makeArray() {
    this.myArray = [];
    this.learnerList.forEach(list => {
      let tempObj = {
        OwingFee: list.OwingFee,
        IsEmailSent: list.IsEmailSent
      };
      Object.assign(list.Learner, tempObj, list);
      this.myArray.push(list.Learner);
    });
  }

  // sort item
  onSort(orderBy, orderControls?) {
    this.ngTable.sorting(this.myArray, orderBy, orderControls)
  }

  onSearch(event, initValue?) {
    if (event !== null && !(event.type == 'keydown' && event.key == 'Enter')) {
      return;
    }
    else {
      let searchString: string;
      let searchBy: string;
      let searchingInputObj = document.getElementById('searchingInput');

      (initValue == undefined) ? { searchString, searchBy } = { searchString: searchingInputObj['value'], searchBy: 'FirstName' } :
        { searchString, searchBy } = initValue;

      //If there is a value, do search. If there is no value, return the initial list.
      if (searchingInputObj['value']) {
        this.isSearchingFlag = true
        this.myArray = this.temLearnerList.map(data => data.Learner)
        this.myArray = this.ngTable.searching(this.myArray, searchBy, searchString);
        // change length inside pagination
        this.learnerListLength = this.myArray.length;
      } else {
        this.isSearchingFlag = false
        this.myArray = this.temLearnerList.map(data => data.Learner)
        // change length inside pagination
        this.learnerListLength = this.temLearnerListLength
      }
    }
  }

  // downloadInvoice() {
  //   let doc = new jsPDF('p', 'pt', 'a4');
  //
  //   let text = `${this.studentFullName}'s Payment Invoice`;
  //   let xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * 20 / 2);
  //
  //   doc.setFontSize(20);
  //   doc.text(text, xOffset, 50);
  //
  //   doc.setFontSize(14);
  //   doc.text(`Invoice To:  ${this.studentFullName}`, 30, 100);
  //   doc.text(`For`, 30, 120);
  //   doc.text(`1 Lesson of ${this.cateName} trial course,`, 40, 140);
  //   doc.text(`by ${this.whichTeacher.FirstName}  ${this.whichTeacher.LastName},`, 40, 160);
  //   doc.text(`from ${this.startTime} to ${this.endTime},`, 40, 180);
  //   doc.text(`at ${this.orgName} ${this.avaliableRoom.RoomName}.`, 40, 200);
  //   doc.text(`Price:`, 30, 250);
  //   doc.text(`$ ${this.coursePrice + this.extraFee}`, 220, 250);
  //   //Total
  //   doc.setFontSize(25);
  //   doc.text(`TOTAL: $ ${this.coursePrice + this.extraFee}`, 30, 350);
  //   doc.setFontSize(14);
  //   doc.text(`Create Date: ${new Date().toLocaleString()}`, 30, 370);
  //
  //   doc.save('aaaa');
  // }

  downloadInvoice() {
    let doc = new jsPDF('p', 'pt', 'a4');
    let text = `Invoice`;
    let xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * 20 / 2);
    doc.setFontSize(20);
    doc.text(text, xOffset, 50);
    doc.save('aaaa');
  }
}
