import { Component, OnInit, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { CoursesService } from '../../../../../services/http/courses.service';
import { from } from 'rxjs';


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
  public CourseSchedule: FormArray;
  public courseNamefilter: Array<any>;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  //Level dropdown options
  public courseName: Array<any>;
  public tutorName: Object;
  public locationName: Object;
  public roomName: any;
  public rooms: Array<any>;
  public roomsUpdate: Array<any>;

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
    this.getLocation();
    this.getRoom();
  }

  /*********** For Dropdown Options *************************************************/
  getCourseName() {
    this.coursesService.getCourseNames().subscribe(
      (res) => {
        this.courseName = res.Data;
        // filter to show only group class
        this.courseNamefilter = this.courseName.filter((item) => item.CourseType == 2);
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
  getLocation() {
    this.coursesService.getLocations().subscribe(
      (res) => {
        this.locationName = res.Data;
      },
      (err) => {
        alert('Serve error!')
      }
    )
  }
  getRoom() {
    this.coursesService.getRooms().subscribe(
      (res) => {
        this.roomName = res.Data;
      },
      (err) => {
        alert('Serve error!')
      }
    )
  }

  // Filter rooms selecting by Location
  filterrooms(num) {
    this.rooms = this.roomName.filter((item) => item.OrgId == num);
  }

  // Validate EndDate > BeginDate
  onBeginDateSelection(date: NgbDate) {
    if (date.after(this.toDate)) {
      alert('End Date must be later than Begin Date')      
    } else {
      this.fromDate = date;
    }
  }
  onEndDateSelection(date) {
    if (date.before(this.fromDate)) {
      alert('End Date must be later than Begin Date')      
    } else {
      this.toDate = date;
    }
  }

  // shown data during opening add & edit modal
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
        CourseSchedule: this.fb.array([this.formArrayAssemble()])
      }
    } else {
      groupObj = {
        CourseId: [this.whichCourseClass.CourseId, Validators.required],
        TeacherId: [this.whichCourseClass.TeacherId, Validators.required],
        BeginDate: [this.whichCourseClass.BeginDate, Validators.required],
        EndDate: [this.whichCourseClass.EndDate, Validators.required],
        OrgId: [this.whichCourseClass.OrgId, Validators.required],
        RoomId: [this.whichCourseClass.RoomId, Validators.required],
        CourseSchedule: this.fb.array([this.formArrayAssembleUpdate()])
      }
      // console.log(groupObj.RoomId)
    }
    return groupObj;
  }
  // Begin time Arrays
  formArrayAssemble() {
    return this.fb.group({ BeginTime: [null, Validators.required] })
  }
  formArrayAssembleUpdate(){
    return this.fb.group({ BeginTime: [this.whichCourseClass.BeginTime, Validators.required] })
  }
  // add time
  newTime() {
    const sches = this.updateForm.controls.CourseSchedule as FormArray;
    sches.push(this.formArrayAssemble());
  }
  deleteTime(index){
    const sches = this.updateForm.controls.CourseSchedule as FormArray;
    sches.removeAt(index);
  }

  /***** Post form ********************************************************/
  onSubmit() {
    let valueToSubmit = this.updateForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    if (vailadValue !== null && this.updateForm.dirty) {
      this.submitByMode(vailadValue);
    } else if (!this.updateForm.dirty) {
      this.errorMessage = 'Data did no changing!';
    } else {
      this.errorMessage = 'Input incorrect.'
    }
  }

   // check whether data vailad or not(ruled by Validators).
  checkInputVailad(valueToSubmit) {
    if (this.updateForm.status == 'VALID') {
      return valueToSubmit;
    }
    else {
      this.infoMessage = 'Please check your input.'
      this.messageColor = '#dc3545'
      return null;
    }
  }

  // Add & Update new data 
  submitByMode(formValue) {
    //while push a stream of new data
    if (this.command == 0) {
      this.coursesService.addNewCourseClass(formValue).subscribe(
        (res) => {
          console.log(formValue)
          alert('Submit success!');
          this.activeModal.close();
        },
        (err) => {
          this.backendErrorHandler(err);
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
        }
      )
    }
  }
  // Show error message
  backendErrorHandler(err) {
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = 'Error! Please check your input.'
    }
  }
}
