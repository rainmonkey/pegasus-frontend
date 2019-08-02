import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbootstraptableService } from "src/app/services/others/ngbootstraptable.service";
import { TransactionService } from "../../../../../services/http/transaction.service";
import { AdminInvoiceEditModalComponent } from "../admin-invoice-edit-modal/admin-invoice-edit-modal.component";
import { CoursesService } from "../../../../../services/http/courses.service";
import {
  DownloadPDFService,
  IInvoiceLearnerName,
  IInvoice
} from "../../../../../services/others/download-pdf.service";
import Swal from "sweetalert2";

interface Learner {
  OwingFee: string | number;
  IsEmailSent: string | number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  IsUnder18: string;
}
@Component({
  selector: "app-admin-invoice-list",
  templateUrl: "./admin-invoice-list.component.html",
  styleUrls: ["./admin-invoice-list.component.css"]
})
export class AdminInvoiceListComponent implements OnInit {
  public learnerList: any;
  public learnerListLength: number;
  public temLearnerList: any; // save the original List
  public temLearnerListLength: number; // save the original List length
  public page = 1; // pagination current page
  public pageSize = 10; // [can modify] pagination page size

  // error alert
  public errorMsg;
  public errorAlert = false;
  public errMsgM;
  public errMsgO;
  public userId;
  isLoad = false;

  public isSearchingFlag = false;
  // learner name and
  learner: Learner;
  terms: [];
  termId: number;
  myArray = [];
  // teachers list copy. Using in searching method, in order to initialize data to original
  public myArrayCopy: Array<any>;

  searchStringCopy: string;

  constructor(
    private modalService: NgbModal,
    private ngTable: NgbootstraptableService,
    private transactionService: TransactionService,
    private coursesService: CoursesService,
    private downloadPDFService: DownloadPDFService
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem("userID");
    this.getTerm();
  }

  clearSearch() {
    this.isSearchingFlag = false;
    this.myArray = this.temLearnerList.map(data => data.Learner);
    this.learnerListLength = this.temLearnerListLength;
  }

  // modal method
  open(item) {
    const modalRef = this.modalService.open(AdminInvoiceEditModalComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    // pass parameters to edit modals
    modalRef.result.then(result => {
      this.getData(this.searchStringCopy);
    });
    modalRef.componentInstance.item = item;
  }

  // get data from server side
  getData(searchValue?: string) {
    this.isLoad = true;
    this.transactionService.getLearnerInvo(this.userId, this.termId).subscribe(
      res => {
        this.learnerList = res.Data;
        this.learnerListLength = res.Data.length; // length prop is under Data prop
        this.temLearnerList = res.Data;
        this.temLearnerListLength = res.Data.length;
        this.isLoad = false;
        // make array for sort
        this.makeArray();
        if (searchValue) {
          this.isSearchingFlag = true;
          this.myArray = this.ngTable.searching(
            this.myArray,
            "FirstName",
            searchValue
          );
          this.learnerListLength = this.myArray.length;
        }
      },
      error => {
        this.isLoad = false;
        this.errorMsg = JSON.parse(error.error);
        console.log("Error!", this.errorMsg.ErrorMsg);
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: error.error.ErrorMessage
        });
        this.errorAlert = false;
      }
    );
  }

  onChange(value) {
    this.termId = +value;
  }

  onSubmit() {
    this.getData();
  }

  getTerm() {
    const today = new Date();
    this.coursesService.getoioi().subscribe(
      res => {
        this.terms = res.Data;
        for (const e of this.terms) {
          this.termId = e["TermId"];
          if (
            today >= new Date(e["BeginDate"]) &&
            today <= new Date(e["EndDate"])
          ) {
            break;
          }
        }
        this.getData();
      },
      error => {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: error.error.ErrorMessage
        });
      }
    );
  }

  // push to array for sort
  makeArray() {
    this.myArray = [];
    this.learnerList.forEach(list => {
      const tempObj = {
        OwingFee: list.OwingFee,
        IsEmailSent: list.IsEmailSent
      };
      Object.assign(list.Learner, tempObj, list);
      this.myArray.push(list.Learner);
    });
  }

  // sort item
  onSort(orderBy, orderControls?) {
    this.ngTable.sorting(this.myArray, orderBy, orderControls);
  }

  onSearch(event, initValue?) {
    if (event !== null && !(event.type == "keydown" && event.key == "Enter")) {
      return;
    } else {
      let searchString: string;
      let searchBy: string;
      const searchingInputObj = document.getElementById("searchingInput");

      initValue == undefined
        ? ({ searchString, searchBy } = {
            searchString: searchingInputObj["value"],
            searchBy: "FirstName"
          })
        : ({ searchString, searchBy } = initValue);

      this.searchStringCopy = searchString;

      // If there is a value, do search. If there is no value, return the initial list.
      if (searchingInputObj["value"]) {
        this.isSearchingFlag = true;
        this.myArray = this.temLearnerList.map(data => data.Learner);
        this.myArray = this.ngTable.searching(
          this.myArray,
          searchBy,
          searchString
        );
        // change length inside pagination
        this.learnerListLength = this.myArray.length;
        console.log(this.myArray, searchBy, searchString);
      } else {
        this.isSearchingFlag = false;
        this.myArray = this.temLearnerList.map(data => data.Learner);
        // change length inside pagination
        this.learnerListLength = this.temLearnerListLength;
      }
    }
  }

  downloadPDFReady(index, page) {
    const learner = this.myArray[(page - 1) * this.pageSize + index];
    const learnerName = {} as IInvoiceLearnerName;
    learnerName.firstName = learner.FirstName;
    learnerName.lastName = learner.LastName;
    const invoice: IInvoice = learner.Invoice;
    this.downloadPDFService.downloadPDF(learnerName, invoice);
  }
}
