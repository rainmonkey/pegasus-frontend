import { LookUpsService } from 'src/app/services/http/look-ups.service';
import { CoursesService } from 'src/app/services/http/courses.service';
import { Component, OnInit, Input, Output, ViewChildren, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from "@angular/router"
import { forkJoin } from 'rxjs';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-trial-confirm',
  templateUrl: './trial-confirm.component.html',
  styleUrls: ['./trial-confirm.component.css']
})
export class TrialConfirmComponent implements OnInit {
  public paymentMethods: Array<any> = [];
  public trialCoursePrice;
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
  @Input() studentFullName;
  //arrange
  @Input() arrangeFlag
  @ViewChildren('radios') radios;
  @Output() closeModalFlag: EventEmitter<any> = new EventEmitter();

  public whichTeacherFullName;
  public paymentMethodValue = null;
  public startTimeTem;
  public endTimeTem;
  public avaliableRoom;
  public error: boolean = false;
  public loadingGifFlag = false;
  public successFlag = false;
  public extraFee;

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private lookupsService: LookUpsService,
    private CoursesService: CoursesService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.startTimeTem = this.timeFormatting(this.startTime);
    this.endTimeTem = this.timeFormatting(this.endTime);
    this.whichTeacherFullName = this.whichTeacher.FirstName + ' ' + this.whichTeacher.LastName;
    this.getDataFromServer();
    console.log(this.activatedRoute)
  }

  getDataFromServer() {
    let LookUpsService7 = this.lookupsService.getLookUps(7);
    let RoomAvailableCheckService = this.CoursesService.getAvailableRoom(this.orgId, this.startTime, this.endTime);
    let LookUpsService17 = this.lookupsService.getLookUps(17);

    forkJoin([LookUpsService7, RoomAvailableCheckService, LookUpsService17]).subscribe(
      (res) => {
        this.paymentMethods = res[0]['Data'];
        let allAvaliableRoom = res[1]['Data'];
        let extraFee = res[2]['Data'];
        this.getExtraFee(extraFee);
        this.assignRandomRoom(allAvaliableRoom);
      },
      (err) => {
        alert('Sorry, something went wrong.')
      }
    );
  }

  assignRandomRoom(allAvaliableRoom) {
    let length = allAvaliableRoom.length;
    let randomNum = Math.floor(Math.random() * length) + 1;
    this.avaliableRoom = allAvaliableRoom[randomNum];
    //console.log(this.avaliableRoom)
  }

  getExtraFee(extraFee) {
    for (let i of extraFee) {
      if (i.PropValue == 1) {
        this.extraFee = Number(i.PropName);
      }
    }

    this.trialCoursePrice = this.coursePrice + this.extraFee;
  }

  timeFormatting(time) {
    return time.replace('T', '  ');
  }


  getRadioValue(value) {
    this.paymentMethodValue = value;
  }

  onSubmit() {
    if (this.paymentMethodValue == null && !this.arrangeFlag) {
      this.error = true;
      return
    }
    else {
      this.error = false;
    }

    this.loadingGifFlag = true;
    let dataToSubmit = this.prepareData();
    //console.log(this.radios)
    this.CoursesService.postTrialLesson(dataToSubmit).subscribe(
      (res) => {
        this.loadingGifFlag = false;
        this.successFlag = true;
      },
      (err) => {
        console.log(err);
        this.loadingGifFlag = false;
        alert('Sorry,something went wrong in server.');
      }
    )
  }

  prepareData() {
    let obj = {
      "LearnerId": Number(this.learnerId),
      "RoomId": this.avaliableRoom.RoomId,
      "TeacherId": this.whichTeacher.TeacherId,
      "OrgId": this.orgId,
      "BeginTime": this.startTime,
      "EndTime": this.endTime,
      "PaymentMethod": this.paymentMethodValue,
      "Amount": this.coursePrice + this.extraFee,
      "StaffId": Number(localStorage.userID),
      "TrialCourseId": this.courseId,
    }
    return obj
  }

  closeModal() {
    this.closeModalFlag.emit(true);
    this.activeModal.close('Cross click')
  }

  downloadInvoice() {
    let doc = new jsPDF('p', 'pt', 'a4');

    let text = `${this.studentFullName}'s Payment Invoice`;
    let xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * 20 / 2);

    doc.setFontSize(20);
    doc.text(text, xOffset, 50);

    doc.setFontSize(14);
    doc.text(`Invoice To:  ${this.studentFullName}`, 30, 100);
    doc.text(`For`, 30, 120);
    doc.text(`1 Lesson of ${this.cateName} trial course,`, 40, 140);
    doc.text(`by ${this.whichTeacher.FirstName}  ${this.whichTeacher.LastName},`, 40, 160);
    doc.text(`from ${this.startTime} to ${this.endTime},`, 40, 180);
    doc.text(`at ${this.orgName} ${this.avaliableRoom.RoomName}.`, 40, 200);
    doc.text(`Price:`, 30, 250);
    doc.text(`$ ${this.coursePrice + this.extraFee}`, 220, 250);
    //Total
    doc.setFontSize(25);
    doc.text(`TOTAL: $ ${this.coursePrice + this.extraFee}`, 30, 350);
    doc.setFontSize(14);
    doc.text(`Create Date: ${new Date().toLocaleString()}`, 30, 370);

    doc.save('aaaa');
  }
}
