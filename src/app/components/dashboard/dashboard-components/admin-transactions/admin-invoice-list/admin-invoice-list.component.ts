import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { TransactionService } from '../../../../../services/http/transaction.service';
import { AdminInvoiceEditModalComponent } from '../admin-invoice-edit-modal/admin-invoice-edit-modal.component';
import { CoursesService } from '../../../../../services/http/courses.service';
import { DownloadPDFService } from "../../../../../services/others/download-pdf.service"
import Swal from 'sweetalert2';
import * as jsPDF from "jspdf"

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
    private downloadPDFService: DownloadPDFService
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
    console.log(this.myArray)
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

  downloadPDF(index, learner, invoice) {
    //FirstName LastName LessonQuantity CourseName LessonFee BeginDate
    //ConcertFeeName? ConcertFee? LessonNoteFeeName? NoteFee?
    //Other1FeeName? Other1Fee? Other2FeeName? Other2Fee? Other3FeeName? Other3Fee?
    //TotalFee DueDate
    learner = this.myArray[index]
    let invDetail = learner.Invoice;
    let currentHeight: number = 50
    let interval: number = 10
    // Landscape export, 2×4 inches
    let doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [600, 460]
    });
    // title
    doc.setFontSize(20);
    doc.text(`Able Music Studio`, 75, 20);
    // detail
    doc.setFontSize(12);
    doc.text(`Invoice To: ${learner.FirstName}  ${learner.LastName}`, 30, 30);

    doc.setFontSize(10)
    doc.text(`For`, 30, 40);
    doc.text(`${invDetail.LessonQuantity} Lessons of ${invDetail.CourseName}`, 35, 46);
    doc.text(`$${invDetail.LessonFee}`, 170, 50);
    doc.text(`From the Date ${invDetail.BeginDate.slice(0, 10)}`, 35, 50)

    if (invDetail.ConcertFee) {
      currentHeight += interval
      doc.text(`${invDetail.ConcertFeeName}`, 35, currentHeight);
      doc.text(`$${invDetail.ConcertFee}`, 170, currentHeight);
    }

    if (invDetail.NoteFee) {
      currentHeight += interval
      doc.text(`${invDetail.LessonNoteFeeName}`, 35, currentHeight);
      doc.text(`$${invDetail.NoteFee}`, 170, currentHeight);
    }

    if (invDetail.Other1Fee) {
      currentHeight += interval
      doc.text(`Others: ${invDetail.Other1FeeName}`, 35, currentHeight)
      doc.text(`$${invDetail.Other1Fee}`, 170, currentHeight)
    }

    if (invDetail.Other2Fee) {
      currentHeight += interval
      doc.text(`${invDetail.Other2FeeName}`, 35, currentHeight)
      doc.text(`$${invDetail.Other2Fee}`, 170, currentHeight)
    }

    if (invDetail.Other3Fee) {
      currentHeight += interval
      doc.text(`${invDetail.Other3FeeName}`, 35, currentHeight)
      doc.text(`$${invDetail.Other3Fee}`, 170, currentHeight)
    }

    doc.setFontSize(16);
    currentHeight += interval * 2
    doc.text(`TOTAL:$ ${invDetail.TotalFee}`, 30, currentHeight);

    doc.setFontSize(10);
    currentHeight += interval
    doc.text(`Due Date: ${invDetail.DueDate.slice(0, 10)}`, 30, currentHeight);
    doc.save(`${learner.FirstName}  ${learner.LastName}'s invoice`);
  }
}
