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
  InitialSessionList;
  teacherSearchValue: string;
  isloading = false;
  searchBeginDate;
  searchEndDate;
  public SessionList: any;
  public SessionListLength: number;
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
    const today = new Date();
    const todayDate = this.datePipe.transform(today, 'yyyy-MM-dd')
    const weekbeforeDate = this.datePipe.transform(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), 'yyyy-MM-dd')
    console.log(weekbeforeDate)
    console.log(todayDate)
    this.getData(weekbeforeDate, todayDate);
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
        this.InitialSessionList = res.Data;
        this.SessionList = res.Data;
        this.SessionListLength = res.Data.length; // length prop is under Data prop
      },
      error => {
        alert('Server Error')
        this.isloading = false;
      });
  }

  searchByDate = () => {
    const beginDate = this.searchBeginDate == null ? alert('please enter begin date') :
      this.datePipe.transform(this.searchBeginDate, 'yyyy-MM-dd');
    const endDate = this.searchEndDate == null ? alert('please enter end date') :
      this.datePipe.transform(this.searchEndDate, 'yyyy-MM-dd');
    if (beginDate == null || endDate == null) {
      return;
    }
    this.getData(beginDate, endDate);
  }

  teacherSearch = () => {
    this.SessionList = this.InitialSessionList;
    this.SessionList = this.SessionList.filter(s =>
      s.TeacherFirstName.toString().toUpperCase().includes(this.teacherSearchValue.toString().toUpperCase()));
    this.SessionListLength = this.SessionList.length;
  }
}
