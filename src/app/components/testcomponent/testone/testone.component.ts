import { Component, OnInit, ViewChildren } from '@angular/core';
import { CoursesService } from '../../../services/http/courses.service';
import { FormGroup, FormBuilder } from '@angular/forms';



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
    private fb: FormBuilder
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



}

