import { Component, OnInit, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../../../../services/http/courses.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Injectable()
@Component({
  selector: 'app-course-class-detail-modal',
  templateUrl: './course-class-detail-modal.component.html',
  styleUrls: ['./course-class-detail-modal.component.css'],
  providers: [{
    provide: NgbDateAdapter,
    useClass: NgbDateNativeAdapter
  }]
})
export class CourseClassDetailModalComponent implements OnInit {
  public errorMessage: string;
  public successMessage: string;
  public infoMessage: string = '';
  public messageColor: string;
  public updateForm: FormGroup;
  //Level dropdown options
  public courseName: Object;
  public tutorName: Object;
  public locationName: Object;
  public roomName: Object;

  @Input() command;
  @Input() whichCourseClass;


  constructor(
    public activeModal: NgbActiveModal,
    private coursesService: CoursesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group(this.formGroupAssemble());
    this.getCourseName();
    this.getTeacher();
    this.getLocationRoom();
  }

  /* For Dropdown Options*/
  getCourseName() {
    this.coursesService.getCourseNames().subscribe(
      (res) => {
        this.courseName = res.Data;
      },
      (err) => {
        alert('Server error!')
      }
    )
  }
  getTeacher() {
    this.coursesService.getTeachers().subscribe(
      (res) => {
        this.tutorName = res.Data;
      },
      (err) => {
        alert('Serve error!')
      }
    )
  }
  getLocationRoom() {
    this.coursesService.getLocationsRooms().subscribe(
      (res) => {
        this.locationName = res.Data;
        this.roomName = res.Data;
      },
      (err) => {
        alert('Serve error!')
      }
    )
  }

  formGroupAssemble() {
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        CourseId: [null, Validators.required],
        TeacherId: [null, Validators.required],
        BeginDate: [null, Validators.required],
        EndDate: [null, Validators.required],
        OrgId: [null, Validators.required],
        RoomId: [null, Validators.required],
        BeginTime: [null, Validators.required],
        EndTime: [null, Validators.required]
      }      
    } else {
      groupObj = {
        //formControlName 决定了提交表单时的参数名
        CourseId: [this.whichCourseClass.CourseId, Validators.required],
        TeacherId: [this.whichCourseClass.TeacherId, Validators.required],
        BeginDate: [this.whichCourseClass.BeginDate, Validators.required],
        EndDate: [this.whichCourseClass.EndDate, Validators.required],
        OrgId: [this.whichCourseClass.OrgId, Validators.required],
        RoomId: [this.whichCourseClass.RoomId, Validators.required],
        BeginTime: [this.whichCourseClass.schedule.BeginTime, Validators.required],
        EndTime: [this.whichCourseClass.schedule.EndTime, Validators.required]
      }
    }
    return groupObj;
  }

  onSubmit() {
    let valueToSubmit = this.updateForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    // fix this
    if (vailadValue !== null && this.updateForm.dirty) {
      // console.log('Correct')
      this.stringifySubmitStr(vailadValue);
      // console.log(this.updateForm.value);
    } else if (!this.updateForm.dirty) {
      this.errorMessage = 'Data did no changing!';
    } else {
      console.log(valueToSubmit)
      this.errorMessage = 'Input incorrect.'
    }
  }

  /*
   check whether data vailad or not(ruled by Validators).
  */
  checkInputVailad(valueToSubmit) {
    if (this.updateForm.status == 'VALID') {
      console.log(valueToSubmit)
      return valueToSubmit;     
    }
    else {
      this.infoMessage = 'Please check your input.'
      this.messageColor = '#dc3545'
      return null;
    }
  }

  /*
    after stringify submition string, data is ready to submit
  */
  stringifySubmitStr(formValue) {
    this.errorMessage = '';
    this.submitByMode(formValue);
  }

  submitByMode(formValue) {
    //while push a stream of new data
    if (this.command == 0) {
      this.coursesService.addNewCourseClass(formValue).subscribe(
        (res) => {          
          alert('Submit success!');
          this.activeModal.close();
        },
        (err) => {
          this.backendErrorHandler(err);
          // console.log(err);
        }
      );
    }
    //while update data
    else if (this.command == 2) {
      this.coursesService.updateCourseClass(formValue, this.whichCourseClass.CourseId).subscribe(
        (res) => {
          alert('Submit success!');
          this.activeModal.close();
        },
        (err) => {
          this.backendErrorHandler(err);
          // console.log(err);
        }

      )
    }
  }

  backendErrorHandler(err) {
    console.warn(err)
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = 'Error! Please check your input.'
    }
  }
}
