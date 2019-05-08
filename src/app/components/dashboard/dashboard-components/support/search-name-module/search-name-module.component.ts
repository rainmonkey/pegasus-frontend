import { Component, OnInit } from '@angular/core';
import { LearnersService } from '../../../../../services/http/learners.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-search-name-module',
  templateUrl: './search-name-module.component.html',
  styleUrls: ['./search-name-module.component.css']
})
export class SearchNameModuleComponent implements OnInit {
  a = false;
  // learners
  public name: any = 'type..';
  public learners: any;
  public data: any;
  public errorMsg;
  public show: boolean;
  public payPath;
  // ng-modal variable
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private learnersListService: LearnersService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  // form-builder
  // learners information
  registrationFormL = this.fb.group({
    learnerId: [''],
    learnerName: [{ value: null, disabled: true }],
    lastName: [{ value: null, disabled: true }],
    middleName: [{ value: null, disabled: true }],
    age: [''],
    email: [{ value: null, disabled: true }],
    phone: [{ value: null, disabled: true }],
    payment: [''],
    schedule: [''],
    owning: [''],
    address: ['']
  });

  searchForm = this.fb.group({
    search: ['', Validators.required]
  });
  get search() {
    return this.searchForm.get('search');
  }

  // searchEnter(event, content) {
  //   if (event.key === '') {
  //     open(content);
  //   }
  // }
  patchRegiFormL() {
    this.registrationFormL.patchValue({
      learnerId: this.learners.LearnerId,
      learnerName: this.learners.FirstName,
      lastName: this.learners.LastName,
      email: this.learners.Email,
      phone: this.learners.ContactNum,
      address: this.learners.Address
    });
    this.onChangePath(this.learners.LearnerId);
  }
  modalServiceMethod(content) {
    if (this.data.length > 1) {
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          result => {
            this.closeResult = `Closed with: ${result}`;
          },
          reason => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }
  open(content) {
    // search learner
    this.learnersListService
      .getLearners(this.searchForm.value.search)
      .subscribe(data => {
        if (data['Data'].length === 0) {
          this.registrationFormL.value.learnerId = 0;
          alert('please enter a correct first name');
        }
        else {
          this.learners = data['Data'][0];
          this.data = data['Data'];
          this.onChangePath(this.learners.LearnerId);
          this.patchRegiFormL();
          this.modalServiceMethod(content);
        }
      },
        (error) =>
          // alert(error);
          console.log(error)
      );
  }

  onChangePath(id) {
    console.log('route, ', this.router);

    this.router.navigate(['payment/product', id]);
  }

  // middle name method
  selectChange(dis) {
    const i: number = dis.value;
    if (!isNaN(Number(i))) {
      this.registrationFormL.patchValue({
        learnerId: this.data[i].LearnerId,
        learnerName: this.data[i].FirstName,
        lastName: this.data[i].LastName,
        email: this.data[i].Email,
        phone: this.data[i].ContactNum
      });
      this.learners.learnerId = this.data[i].LearnerId;
      this.onChangePath(this.learners.learnerId);
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnInit() {}

}
