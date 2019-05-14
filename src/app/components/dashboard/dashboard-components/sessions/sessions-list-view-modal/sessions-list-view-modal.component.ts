import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeachersService } from '../../../../../services/http/teachers.service';
import { FormBuilder, Validator, Validators, RequiredValidator } from '@angular/forms';
import { PaymentService } from '../../../../../services/http/payment.service';

@Component({
  selector: 'app-sessions-edit-modal',
  templateUrl: './sessions-edit-modal.component.html',
  styleUrls: ['./sessions-edit-modal.component.css'],
})
export class SessionsEditModalComponent implements OnInit {
  public learnerList;
  public errorMsg;
  public errorAlert = false;
  public errMsgO = false;
  public errMsgM = false;
  public successAlert = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private teachersService: TeachersService,
    private paymentService: PaymentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {

     }

  // invoice list fb
  invoiceEditForm = this.fb.group({
    EndTime: ['18:00, 5-4-2019'],
    CourseName: ['Piano'],
    Room: ['13'],
    BeginTime: ['15:00, 10-4-2019'],
    Teacher: ['Zhu'],
    Canceled: ['No'],
    CanceledReason: [''],
    NoteFee: [3],
    TrialCourse: ['No'],
    Branch: ['AMA Pakuranga Branch']
  });

  ngOnInit() {
    this.getInvoiceData();
  }
// get invoice from server
  getInvoiceData() {
    this.teachersService.getTeachersInfo().subscribe(
      (res) => {
        this.learnerList = res.Data;
        //this.patchToInvoice()
      },
      error => {
        this.errorMsg = JSON.parse(error.error);
        console.log('Error!', this.errorMsg.ErrorCode);
        this.errorAlert = false;
      });
  }
// patch data to invoiceEditForm
  patchToInvoice() {
    this.invoiceEditForm.value.patch({

    });
  }
  // close alert
  closeSucc(){
    this.successAlert = false;
  }
  closeErro(){
    this.errorAlert = false;
  }

// post data to server side
  sendMail(confirmModal) {
    this.open(confirmModal);
    this.paymentService.emailInvoice(this.invoiceEditForm.value)
    .subscribe(
      (res) => {
        this.router.navigate(['../success'], {relativeTo: this.activatedRoute});
      },
      (error) => {
        this.errorMsg = JSON.parse(error.error);
        this.errorAlert = true;
        alert(this.errorMsg.ErrorCode);
      }
    );
  }

// confirm Modal
  open(confirmModal) {
    this.modalService
    .open(confirmModal)
    .result.then(
      result => {
        this.paymentService.emailInvoice(this.invoiceEditForm.controls.value).subscribe(
          response => {
            console.log('Success!', response);
            this.successAlert = true;
            alert('Your Payment Has Been Made');
          },
          (error) => {
            this.errorMsg = JSON.parse(error.error);
            this.errorAlert = true;
            console.log('Error!', this.errorMsg.ErrorCode);
            alert(this.errorMsg.ErrorCode);
          }
        );
      });
  }
}
