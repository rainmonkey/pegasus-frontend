import { CoursesService } from 'src/app/services/http/courses.service';
import { LookUpsService } from './../../../../../services/http/look-ups.service';
import { Component, OnInit, Input, Output, ViewChildren, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

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
  @Output() closeModalFlag: EventEmitter<any> = new EventEmitter();

  public whichTeacherFullName;
  public paymentMethodValue=null;
  public startTimeTem;
  public endTimeTem;
  public error:boolean = false;
  public loadingGifFlag = false;
  public successFlag = false;

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private lookupsService: LookUpsService,
    private CoursesService: CoursesService) { }

  ngOnInit() {
    this.startTimeTem = this.timeFormatting(this.startTime);
    this.endTimeTem = this.timeFormatting(this.endTime);
    this.whichTeacherFullName = this.whichTeacher.FirstName + ' ' + this.whichTeacher.LastName;
    this.getDataFromServer();

  }

  getDataFromServer() {
    let LookUpsService = this.lookupsService.getLookUps(7);
    

    forkJoin([LookUpsService]).subscribe(
      (res) => {
        this.paymentMethods =  res[0]['Data'];
      },
      (err) => {
        alert('Sorry, something went wrong.')
      }
    );
  }

  timeFormatting(time) {
    return time.replace('T', '  ');
  }


  getRadioValue(value){
    this.paymentMethodValue = value;
  }

  onSubmit() {
    if(this.paymentMethodValue == null){
      this.error = true;
      return
    }
    else{
      this.error = false;
    }

    this.loadingGifFlag = true;
    let dataToSubmit = this.prepareData();
    //console.log(this.radios)
    this.CoursesService.postTrialLesson(dataToSubmit).subscribe(
      (res) =>{
        this.loadingGifFlag = false;
        this.successFlag = true;
      },
      (err) =>{
        console.log(err);
        this.loadingGifFlag = false;
        alert('Sorry,something went wrong in server.');
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
      "StaffId":  Number(localStorage.userID),
      "TrialCourseId": this.courseId
    }
    return obj
  }

  closeModal(){
    this.closeModalFlag.emit(true);
    this.activeModal.close('Cross click')
  }
}
