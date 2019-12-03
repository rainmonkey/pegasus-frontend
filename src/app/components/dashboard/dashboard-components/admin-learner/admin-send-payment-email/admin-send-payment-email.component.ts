import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

import {
  DownloadPDFService,
  IInvoiceLearnerName,
  IInvoice
} from "../../../../../services/others/download-pdf.service";

import { PostEmailServiceService } from "../../../../../services/http/post-email-service.service";

@Component({
  selector: 'app-admin-send-payment-email',
  templateUrl: './admin-send-payment-email.component.html',
  styleUrls: ['./admin-send-payment-email.component.css']
})
export class AdminSendPaymentEmailComponent implements OnInit {

  private emailForm: FormGroup;

  private selectAttachment: boolean;

  public errorMessage: string;

@Input() learnlist;
@Input() selectArray;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private downloadPDFService: DownloadPDFService,
    private emailService: PostEmailServiceService
  ) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      title: [''],
      contents: [''],
      attachment: ['']
    });
  }

  checkAttachmentClick(){

  }

  onSubmit(){

    for(let i=0; i<this.selectArray.length; i++){
      if(true == this.selectArray[i]){
        let email = this.learnlist[i].Learner.Email;
        let firstName = this.learnlist[i].Learner.FirstName;
        let lastName = this.learnlist[i].Learner.LastName;
        var name = firstName + " " + lastName;
        let title = this.emailForm.value.title;
        let contents = this.emailForm.value.contents;
        console.log("debug", contents);

        let para1 = {
        MailTo : email,
          MailTitle : title,
          MailContent : contents,
          MailToName : firstName      
        };


        const learnerName = {} as IInvoiceLearnerName;
        // let invoice;
        learnerName.firstName = firstName;
        learnerName.lastName = firstName;
        learnerName.Email = email;


        let para2 = this.downloadPDFService.downloadPDF_blob(learnerName, this.learnlist[i].Invoice, this.learnlist[i].Learner.Org);

        console.log(para2);


        this.emailService.postEmail(para1, para2).subscribe((res) => {
          Swal.fire({
            title: 'Server error!',
            type: 'error',
            showConfirmButton: true,
          });
console.log(res);
          this.activeModal.close();
        },
        (err) => {
          this.backendErrorHandler(err);
        });
      }
    }

  }  

  backendErrorHandler(err) {
    console.warn(err)
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = 'Error! Please check your input.'
    }
  }  

  // http://gradspace.org:5000/api/SendMail

  // Post:(formdata)
  //   para1:Mail :string 
    
  //   {
  //     "MailTo": "edwin.zhu02@gmail.com",
  //     "MailTitle": "hello",
  //     "MailContent": "Your invoice is due, Please payment on time.",
  //     "MailToName": "edwin"
  //   }
  
  //   para2:Attachment: file	  
}
