import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbootstraptableService } from 'src/app/services/others/ngbootstraptable.service';
import { SessionsService } from '../../../../../../services/http/sessions.service';
import { PaymentService } from 'src/app/services/http/payment.service';
import { SessionDetailEditModalComponent } from '../../session-modals/session-detail-edit-modal/session-detail-edit-modal.component';
import {SessionCancelModalComponent} from '../../session-modals/session-cancel-modal/session-cancel-modal.component';
import {SessionCompletedModalComponent} from '../../session-modals/session-completed-modal/session-completed-modal.component';

@Component({
  selector: 'app-sessions-list-view',
  templateUrl: './sessions-list-view.component.html',
  styleUrls: ['./sessions-list-view.component.css'],
})
export class SessionsListViewComponent implements OnInit {
  public learnerList: any;
  public learnerListLength: number;
  public temLearnerList: any; // save the original teacherList
  public temLearnerListLength: number; // save the original teacherList length
  public page: number = 1;  // pagination current page
  public pageSize: number = 10;    // [can modify] pagination page size
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
    private paymentService: PaymentService,
    ) { }

  ngOnInit() {
    this.getData();
  }

  // open confirm modal
  openSessionConfirmModal(lessonId){
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
  getData() {
    this.sessionsService.getReceptionistLessonBetweenDate('2019-04-29', '2019-05-10').subscribe(
      (res) => {
        this.learnerList = res.Data;
        this.learnerListLength = res.Data.length; // length prop is under Data prop
        this.temLearnerList = res.Data;
        this.temLearnerListLength = res.Data.length;
      },
      error => {
        this.errorMsg = JSON.parse(error.error);
        console.log('Error!', this.errorMsg.ErrorCode);
        this.errorAlert = false;
      });
  }
}
