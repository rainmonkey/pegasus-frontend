import { CoursesService } from 'src/app/services/http/courses.service';
import { LookUpsService } from './../../../../../services/http/look-ups.service';
import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trial-confirm',
  templateUrl: './trial-confirm.component.html',
  styleUrls: ['./trial-confirm.component.css']
})
export class TrialConfirmComponent implements OnInit {
  public paymentMethods: Array<any> = [];
  @Input() startTime;
  @Input() endTime;
  @Input() orgName;
  @Input() orgId;
  @Input() cateName;
  @Input() cateId;
  @Input() whichTeacher;
  @Input() coursePrice;
  @Input() learnerId;
  @Input() courseId;
  @ViewChildren('radios') radios;

  public whichTeacherFullName;
  public paymentMethodValue;
  public startTimeTem;
  public endTimeTem;

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private lookupsService: LookUpsService,
    private CoursesService: CoursesService) { }

  ngOnInit() {
    this.startTimeTem = this.timeFormatting(this.startTime);
    this.endTimeTem = this.timeFormatting(this.endTime);
    this.whichTeacherFullName = this.whichTeacher.FirstName + ' ' + this.whichTeacher.LastName;
    this.getPaymentMethod();
  }

  timeFormatting(time) {
    return time.replace('T', '  ');
  }

  getPaymentMethod() {
    this.lookupsService.getLookUps(7).subscribe(
      (res) => {
        this.paymentMethods = res.Data;
        console.log(this.paymentMethods)
      }
    )
  }

  getRadioValue(value){
    this.paymentMethodValue = value;
  }

  onSubmit() {
    let dataToSubmit = this.prepareData();
    console.log(this.radios)
    this.CoursesService.postTrialLesson(dataToSubmit).subscribe(
      (res) =>{
        console.log(res)
      },
      (err) =>{
        console.log(err)
      }
    )
  }

  prepareData() {
    let obj = {
      "LearnerId": Number(this.learnerId),
      "RoomId": 1,
      "TeacherId": this.whichTeacher.TeacherId,
      "OrgId": this.orgId,
      "BeginTime": this.startTime,
      "EndTime": this.endTime,
      "PaymentMethod": this.paymentMethodValue,
      "Amount": this.coursePrice,
      "StaffId": 1,
      "TrialCourseId": this.courseId
    }

    console.log(obj)
    return obj
  }
}
