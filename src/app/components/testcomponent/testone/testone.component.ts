import { Component, OnInit, ViewChildren } from '@angular/core';
import { CoursesService } from '../../../services/http/courses.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../../dashboard/dashboard-components/support/change-password-modal/change-password-modal.component';



@Component({
  selector: 'app-testone',
  templateUrl: './testone.component.html',
  styleUrls: ['./testone.component.css'],
  animations: [

  ]
})
export class TestoneComponent implements OnInit {
  public qweqwe: Object;
  public poi: FormGroup;
  constructor(
    private courseService: CoursesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    ) { }

  ngOnInit() {
    this.poi = this.fb.group(this.formGroupAssemble());
    this.getoiois();
  }

  formGroupAssemble(){
    let groupObj: any = {TermId:[null]};
    return groupObj;

  }

  getoiois() {
    this.courseService.getoioi().subscribe(
      (res) => {
        this.qweqwe = res.Data;
      }
    )
  }

  onSubmit(qwe){
    this.courseService.postoioi(qwe, qwe).subscribe(
      (res) => {
        console.log("successful");
      }
    )
  }

  changePassword(){
    const modalRef=this.modalService.open(ChangePasswordModalComponent,{size:'lg'})
  }


}

