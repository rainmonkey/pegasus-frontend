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
  public learnerIdByUrl: number
  public data: any;
  public errorMsg;
  public show: boolean;
  public payPath;
  learnerUrlWithoutId;
  errorAlert = false;
  // ng-modal variable
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private learnersListService: LearnersService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private generalRepoService: GeneralRepoService,
  ) {
    // router.events.subscribe(e=>co)
  }

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

  modalServiceMethod(content) {
    if (this.data.length > 1) {
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: "static", keyboard: false })
        .result.then(
          result => {
            console.log(content, result)
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
        this.learners = data['Data'][0];
        this.data = data['Data'];
        if (this.data.length === 1) {
          this.patchRegiFormL();
          // change url
          this.onChangePath(this.learners.LearnerId);
        } else {
          this.modalServiceMethod(content);
        }
        // put learners information to service waiting for other component subscribe
        this.generalRepoService.fisrtName.next(this.learners);
        console.log(this.learners)
        // if (this.data.length === 1) {
        //   this.onChangePath(this.learners.LearnerId);
        // }
      },
        (error) => {
          console.log(error)
          this.errorAlert = true;
          this.errorMsg = error.error;
        }
      );
  }

  patchRegiFormL() {
    this.registrationFormL.patchValue({
      learnerId: this.learners.LearnerId,
      learnerName: this.learners.FirstName,
      lastName: this.learners.LastName,
      email: this.learners.Email,
      phone: this.learners.ContactNum,
      address: this.learners.Address
    });
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
        middleName: this.data[i].MiddleName,
        email: this.data[i].Email,
        phone: this.data[i].ContactNum
      });
      this.learners.learnerId = this.data[i].LearnerId;
      this.generalRepoService.fisrtName.next(this.data[i]);
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
    this.payPath = this.router.url
    let lastRouteNameIsNumber = !Number.isNaN(+this.router.url.slice(this.router.url.lastIndexOf("/") + 1))
    if (lastRouteNameIsNumber) {
      this.learnerIdByUrl = +this.router.url.slice(this.router.url.lastIndexOf("/") + 1)
      this.learnerUrlWithoutId = this.router.url.slice(0, this.router.url.lastIndexOf("/") + 1)
      this.learnersListService.getLearnerList().subscribe(
        data => {
          let learnerList = data["Data"]
          let learner = learnerList.find(data => data.LearnerId == this.learnerIdByUrl)
          this.registrationFormL.patchValue({
            learnerId: learner.LearnerId,
            learnerName: learner.FirstName,
            lastName: learner.LastName,
            middleName: learner.MiddleName,
            email: learner.Email,
            phone: learner.ContactNum
          })
          console.log(this.registrationFormL)
        }
      )
    } else {
      this.learnerUrlWithoutId = this.router.url
    }
    console.log(this.learnerUrlWithoutId)
  }
}
