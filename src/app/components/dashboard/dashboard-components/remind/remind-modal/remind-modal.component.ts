import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { CoursesService } from 'src/app/services/http/courses.service';
import { Remind } from '../../../../../models/remind';

@Component({
  selector: 'app-remind-modal',
  templateUrl: './remind-modal.component.html',
  styleUrls: ['./remind-modal.component.css']
})
export class RemindModalComponent implements OnInit {
  public remindsList:Array<any>;
  whichRemind;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public loginService:AuthenticationService,
    private fb: FormBuilder,
    private courseService: CoursesService,
  ) {
    console.log(this.whichRemind)
   }


  ngOnInit() { 
    console.log(this.whichRemind)
  }
  


}
