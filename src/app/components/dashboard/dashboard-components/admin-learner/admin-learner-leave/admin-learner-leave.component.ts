import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { LearnerDayOff,CancelLessonsModel } from '../../../../../models/LearnerDayOff';
import { LearnersService } from '../../../../../services/http/learners.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-admin-learner-leave',
  templateUrl: './admin-learner-leave.component.html',
  styleUrls: ['./admin-learner-leave.component.css']
})
export class AdminLearnerLeaveComponent implements OnInit {
  learner;
  hasError = false;
  errorMessage;
  checkboxArray = [];
  lessonsOfCourse = [];
  LearnerLeaveForm;
  modal;
  isloading = false;
  isConfirmClick = false;
  selectedLessons = [];
  public isCancelSuccess = false;
  public isCancelFailed = false;
  @ViewChildren('checkbox') checkbox
  @ViewChildren('checkboxLesson') checkboxLesson
  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder, private service: LearnersService) { }

  ngOnInit() {
    this.LearnerLeaveForm = this.fb.group({
      BeginDate: [''],
      EndDate: [''],
      Reason: ['', Validators.required],
      IsInvoiceChange: ['', Validators.required]
    });
    console.log(this.learner)
    this.getLessons();
  }

  get BeginDate() {
    return this.LearnerLeaveForm.get('BeginDate');
  }
  get EndDate() {
    return this.LearnerLeaveForm.get('EndDate');
  }
  get Reason() {
    return this.LearnerLeaveForm.get('Reason');
  }
  get IsInvoiceChange() {
    return this.LearnerLeaveForm.get('IsInvoiceChange');
  }
  getLessons = () => {
    let fun = [];
    this.lessonsOfCourse = []
    this.isloading = true;
    this.learner.One2oneCourseInstance.forEach(element => {
      fun.push(this.service.getLessonsByCourseInstanceId(element.CourseInstanceId));
    });
    forkJoin(...fun).subscribe(
      res => {
        // let lessons;
        for (let i = 0; i < fun.length; i++) {
          let lessons = res[i]['Data'];
          this.lessonsOfCourse.push(this.formatLessons(lessons));
        };

        console.log(this.lessonsOfCourse)
        this.isloading = false;
      }
      , err => {
        console.log(err)
      })
    return this.lessonsOfCourse;
  }
  formatLessons = (lessons) => {
    let lastInvoice = '', formatLessons = [];
    let i = -1;
    lessons.forEach(e => {
      if (lastInvoice != e.InvoiceNum) {
        formatLessons.push([]);
        i++;
      }
      lastInvoice = e.InvoiceNum;
      e.strDate = e.BeginTime.slice(5, 7) + '/' + e.BeginTime.slice(8, 10);
      console.log(e);
      formatLessons[i].push(e);
    })
    return formatLessons;
  }
  getCheckedLesson = () => {
    this.selectedLessons=[];
    this.checkboxLesson._results.forEach(s => {
      if (s.nativeElement.checked === true) {
        this.selectedLessons.push(Number(s.nativeElement.value));
      }
    });
    console.log(this.selectedLessons);
  }
  // Confirm = () => {
    
  //   this.isCancelFailed = false;
  //   if (this.LearnerLeaveForm.invalid) {
  //     this.CheckAllControllValid();
  //     this.hasError = true;
  //     this.errorMessage = 'The form is invalid';
  //     return;
  //   }
  //   this.hasError = false;
  //   this.isloading = true;
  //   this.isConfirmClick = true;
  //   const LearnerDayoffModel = new LearnerDayOff(
  //     localStorage.getItem('userID'), this.learner.LearnerId,
  //     this.LearnerLeaveForm.value.BeginDate, this.LearnerLeaveForm.value.EndDate,
  //     this.LearnerLeaveForm.value.Reason, this.checkboxArray, this.LearnerLeaveForm.value.IsInvoiceChange
  //   );
  //   this.service.learnerDayOff(LearnerDayoffModel).subscribe(res => {
  //     this.isloading = false;
  //     this.isCancelSuccess = true;
  //   }, err => {
  //     this.isConfirmClick = false;
  //     this.isloading = false;
  //     this.isCancelFailed = true;
  //     Swal.fire({
  //       type: 'error',
  //       title: 'Oops...',
  //       text: err.error.ErrorMessage,
  //     });
  //   });
  // }


  Confirm = () => {
    
    this.isCancelFailed = false;
    if (this.LearnerLeaveForm.invalid) {
      this.CheckAllControllValid();
      this.hasError = true;
      this.errorMessage = 'The form is invalid';
      return;
    }
    this.hasError = false;
    this.isloading = true;
    this.isConfirmClick = true;
    const cancelLessonsModel = {} as CancelLessonsModel;
    this.getCheckedLesson();
    cancelLessonsModel.UserId = Number(localStorage.getItem('userID'));
    cancelLessonsModel.Reason = this.LearnerLeaveForm.value.Reason;
    cancelLessonsModel.IsInvoiceChange = this.LearnerLeaveForm.value.IsInvoiceChange;
    cancelLessonsModel.LessonIds = this.selectedLessons;

    this.service.cancelLessons(cancelLessonsModel).subscribe(res => {
      this.isloading = false;
      this.isCancelSuccess = true;
    }, err => {
      this.isConfirmClick = false;
      this.isloading = false;
      this.isCancelFailed = true;
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.ErrorMessage,
      });
    });
  }
  setCheckBoxDate =() =>{
    let beginDate = this.LearnerLeaveForm.value.BeginDate;
    let endDate = this.LearnerLeaveForm.value.EndDate;
    beginDate = beginDate!=''?beginDate:'2010-01-01';
    endDate = endDate!=''?endDate:'2100-01-01';   
    console.log(beginDate,endDate);
    this.checkboxLesson._results.forEach(s => {
      if ((s.nativeElement.getAttribute('lesson-time').slice(0,10) >= beginDate) && 
        (s.nativeElement.getAttribute('lesson-time').slice(0,10)<= endDate))
        s.nativeElement.checked = true;
      else
        s.nativeElement.checked = false;
        console.log(s.nativeElement);
    });    
  }
  checkBoxChange = (event) => {
    let courseIntanceId = event.target.value;
    this.checkboxArray = [];
    this.checkbox._results.forEach(s => {
      if (s.nativeElement.checked === true) {
        this.checkboxArray.push(Number(s.nativeElement.value));
        console.log(s.nativeElement);
      }
    });
    this.setCheckBox(event.target.checked, courseIntanceId);
  }
  setCheckBox = (isChecked, courseIntanceId) => {
    this.checkboxLesson._results.forEach(s => {
      if (s.nativeElement.name == courseIntanceId)
        s.nativeElement.checked = isChecked;
    });
  }
  CheckAllControllValid = () => {
    for (let i in this.LearnerLeaveForm.controls) {
      this.LearnerLeaveForm.controls[i].touched = true;
    }
  }

}
