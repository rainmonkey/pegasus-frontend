import { Component, OnInit, ViewChildren } from '@angular/core';
import { LearnersService } from '../../../../../services/http/learners.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GeneralRepoService } from '../../../../../services/repositories/general-repo.service';

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
  errorAlert = false;
  // ng-modal variable
  closeResult: string;

  // @ViewChildren('FirstNameValue') firstNameValue;

  constructor(
    private modalService: NgbModal,
    private learnersListService: LearnersService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private generalRepoService: GeneralRepoService
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
    // this.onChangePath(this.learners.LearnerId);
  }

  modalServiceMethod(content) {
    if (this.data.length > 1) {
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          result => {
            this.closeResult = `Closed with: ${result}`;
            this.onChangePath(this.learners.learnerId);
          },
          reason => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }

  open(content) {
    // search learner
    this.errorAlert = false;
    this.router.navigate([this.payPath]);
    this.learnersListService
      .getLearners(this.searchForm.value.search)
      .subscribe(data => {
        console.log(data)
        // if (data['Data'].length === 0) {
        //   this.registrationFormL.value.learnerId = 0;
        //   alert('please enter a correct first name');
        // }
        // else {
          this.learners = data['Data'][0];
          this.data = data['Data'];
          this.patchRegiFormL();
          this.modalServiceMethod(content);
          // put learners information to service waiting for other component subscribe
          this.generalRepoService.fisrtName.next(this.learners);
          // change url
          if (this.learners.length === 1 ){
          this.onChangePath(this.learners.LearnerId);}
        // }
      },
        (error) => {
          console.log(error)
          this.errorAlert = true;
          this.errorMsg = error.error;
        }
      );
  }

  // close alert
  closeErro() {
    this.errorAlert = false;
  }

  onChangePath(id) {
    this.router.navigate([this.payPath, id]);
  }

  // middle name method
  selectChange(dis) {
    const i: number = dis.value;
    if (!isNaN(Number(i))) {
      console.log(this.data[i])
      this.registrationFormL.patchValue({
        learnerId: this.data[i].LearnerId,
        learnerName: this.data[i].FirstName,
        lastName: this.data[i].LastName,
        email: this.data[i].Email,
        phone: this.data[i].ContactNum
      });
      this.learners.learnerId = this.data[i].LearnerId;
      this.generalRepoService.fisrtName.next(this.data[i]);
      console.log(this.generalRepoService);
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

  ngOnInit() {
    this.activatedRouter.url.subscribe(url => {
      const path1 = url[0].path;
      if (path1 === "credit") {
        this.payPath = "learner/" + path1
      } else {
        let path2 = url[1].path;
        if (path2 === 'invoice') {
          path2 = 'invoice';
          this.payPath = `/${path1}/${path2}/`;
        } else {
          this.payPath = `/${path1}/${path2}/`;
        }
      }
    });
  }

}
