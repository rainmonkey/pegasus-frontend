import { Component, OnInit, ViewChildren } from '@angular/core';
import { CoursesService } from '../../../services/http/courses.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../../dashboard/dashboard-components/support/change-password-modal/change-password-modal.component';
import { environment } from 'src/environments/environment.prod';


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
  public url:any = environment.baseUrl + 'trial'
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
    let groupObj: any = {TermId:[null, Validators.required]};
    return groupObj;

  }

  getoiois() {
    this.courseService.getoioi().subscribe(
      (res) => {
        this.qweqwe = res.Data;
        console.log(this.qweqwe)
      }
    )
  }

  onSubmit(){
    this.courseService.postoioi(this.poi.value.TermId).subscribe(
      (res) => {
        console.log("successful");
        console.log(res);
        alert('Successfully generating ' + res.Data + ' data.')
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  changePassword(){
    const modalRef=this.modalService.open(ChangePasswordModalComponent,{size:'lg'})
  }


}

