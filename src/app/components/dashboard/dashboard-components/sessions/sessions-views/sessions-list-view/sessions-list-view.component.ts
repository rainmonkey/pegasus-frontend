import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { SessionsService } from '../../../../../../services/http/sessions.service';
import { PaymentService } from 'src/app/services/http/payment.service';
import { SessionDetailEditModalComponent } from '../../session-modals/session-detail-edit-modal/session-detail-edit-modal.component';
import {SessionCancelModalComponent} from '../../session-modals/session-cancel-modal/session-cancel-modal.component';
import {SessionCompletedModalComponent} from '../../session-modals/session-completed-modal/session-completed-modal.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-sessions-list-view',
  templateUrl: './sessions-list-view.component.html',
  styleUrls: ['./sessions-list-view.component.css'],
})
export class SessionsListViewComponent implements OnInit {
  isloading = false;
  searchBeginDate;
  searchEndDate;
  public learnerList: any;
  public learnerListLength: number;
  public temLearnerList: any; // save the original teacherList
  public temLearnerListLength: number; // save the original teacherList length
  public page = 1;  // pagination current page
  public pageSize = 10;    // [can modify] pagination page size
  // error alert
  public errorMsg;
  public errorAlert = false;
  public titleArray = [
    '#',
    'Teacher',
    'Learner',
    'Course Name',
    'Trial Course',
    'Begin Time',
    'End Time',
    'Room',
    'Branch',
    'Canceled',
    'Confirmed',
    'Reason'
  ];
  constructor(
    private modalService: NgbModal,
    private ngTable: NgbootstraptableService,
    private sessionsService: SessionsService,
    private datePipe: DatePipe,
    ) { }

  ngOnInit() {
    this.getData('2019-01-01', '2020-01-01');
  }

  // open confirm modal
  openSessionConfirmModal(lessonId) {
    const modalRef = this.modalService.open(SessionCompletedModalComponent);
    (modalRef.componentInstance as SessionCompletedModalComponent).lessonId = lessonId;
    modalRef.result.then(
      () => {
        this.ngOnInit();
      },
      () => {
        this.ngOnInit();
      });
  }

  // modal method
  openSessionEditModal(LessonModel) {
    const modalRef = this.modalService.open(SessionDetailEditModalComponent, { size: 'lg' });
    (modalRef.componentInstance as SessionDetailEditModalComponent).LessonModel = LessonModel;
    modalRef.result.then(
      () => {
        this.ngOnInit();
      },
      () => {
        this.ngOnInit();
      });
  }

  openSessionCancelModal(lessonId){
    const modalRef = this.modalService.open(SessionCancelModalComponent);
    (modalRef.componentInstance as SessionCancelModalComponent).lessionId = lessonId;
    modalRef.result.then(
      () => {
        this.ngOnInit();
      },
      () => {
        this.ngOnInit();
      });
  }

  // get data from server side
  getData(begin, end) {
    this.isloading = true;
    this.sessionsService.getReceptionistLessonBetweenDate(begin, end).subscribe(
      (res) => {
        this.isloading = false;
        this.learnerList = res.Data;
        this.learnerListLength = res.Data.length; // length prop is under Data prop
        this.temLearnerList = res.Data;
        this.temLearnerListLength = res.Data.length;
      },
      error => {
        alert(error);
        this.isloading = false;
      });
  }

  search = () => {
    const beginDate = this.searchBeginDate == null ? alert('please enter begin date') :
      this.datePipe.transform(this.searchBeginDate, 'yyyy-MM-dd');
    const endDate = this.searchEndDate == null ? alert('please enter end date') :
      this.datePipe.transform(this.searchEndDate, 'yyyy-MM-dd');
    if (beginDate == null || endDate == null) {
      return;
    }
    this.getData(beginDate, endDate);
  }
}
