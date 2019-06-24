import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { AdminpaymentlistService } from '../../../../../services/http/adminpaymentlist.service';


@Component({
  selector: 'app-admin-payment-list',
  templateUrl: './admin-payment-list.component.html',
  styleUrls: ['./admin-payment-list.component.css']
})
export class AdminPaymentListComponent implements OnInit {
  //loading
  public loadingFlag: boolean = false;

  public adminPaymentList: any;
  public searchForm: FormGroup;
  public fromDate: NgbDate;
  public toDate: NgbDate;

  constructor(
    private adminpaymentlistService: AdminpaymentlistService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group(this.formGroupAssemble());
  }
  formGroupAssemble() {
    let groupObj: any;
    groupObj = {
      BeginDate: [null, Validators.required],
      EndDate: [null, Validators.required]
    }
    return groupObj;
  }
  // Validate EndDate > BeginDate
  onBeginDateSelection(date: NgbDate) {
    if (date.after(this.toDate)) {
      Swal.fire({
        title: 'End Date must be later than Begin Date!',
        type: 'error',
        showConfirmButton: true,
      });
    } else {
      this.fromDate = date;
    }
  }
  onEndDateSelection(date: NgbDate) {
    if (date.before(this.fromDate)) {
      Swal.fire({
        title: 'End Date must be later than Begin Date!',
        type: 'error',
        showConfirmButton: true,
      });
    } else {
      this.toDate = date;
    }
  }
  // click the search
  onSubmit() {
    let valueToSubmit = this.searchForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    if (vailadValue !== null) {
      if (vailadValue.BeginDate > vailadValue.EndDate) {
        Swal.fire({
          title: 'End Date must be later than Begin Date!',
          type: 'error',
          showConfirmButton: true,
        });
        return;
      } else {
        let begin = vailadValue.BeginDate.year + "-" + vailadValue.BeginDate.month + "-" + vailadValue.BeginDate.day;
        let end = vailadValue.EndDate.year + "-" + vailadValue.EndDate.month + "-" + vailadValue.EndDate.day;
        this.loadingFlag = true;
        this.submitByMode(begin, end);
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
    this.adminpaymentlistService.getPaymentViews(begindate, enddate).subscribe(
      (res) => {
        this.adminPaymentList = res['Data'];
        this.loadingFlag = false;
        console.log(this.adminPaymentList)
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
  }
}
