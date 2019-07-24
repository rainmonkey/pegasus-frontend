import { Component, OnInit, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateNativeAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { CoursesService } from '../../../../../services/http/courses.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

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
  public submitionFlag: boolean = true;
  public loadingGifFlag: boolean = false;
  public messageColor: string;
  public updateForm: FormGroup;
  public CourseSchedule: FormArray;
  public courseNamefilter: Array<any>;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public weeks = [1, 2, 3, 4, 5, 6, 7];
  public begin: any;
  //Level dropdown options
  public courseName: Array<any>;
  public tutorName: Object;
  public locationName: Object;
  public roomName: any;
  public rooms: Array<any>;

  @Input() command;
  @Input() whichCourseClass;

  constructor(
    public activeModal: NgbActiveModal,
    private coursesService: CoursesService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group(this.formGroupAssemble());
    if (this.command == 2) {
      this.formArrayAssembleUpdate();
    }
    this.getCourseName();
    this.getTeacher();
    this.getLocation();
    this.getRoom();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.updateForm.controls;
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
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
        });
        console.log(err.error.ErrorMessage);
      }
    )
  }
  getTeacher() {
    this.coursesService.getTeachers().subscribe(
      (res) => {
        this.tutorName = res.Data;
      },
      (err) => {
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
        });
        console.log(err.error.ErrorMessage);
      }
    )
  }
  getLocation() {
    this.coursesService.getLocations().subscribe(
      (res) => {
        this.locationName = res.Data;
      },
      (err) => {
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
        });
        console.log(err.error.ErrorMessage);
      }
    )
  }
  getRoom() {
    this.coursesService.getRooms().subscribe(
      (res) => {
        this.roomName = res.Data;
        console.log(this.roomName)
        // During editing, run filterrooms() to show Room Num.
        if (this.command == 2) {
          this.filterrooms(this.whichCourseClass.OrgId);          
        }
      },
      (err) => {
        Swal.fire({
          title: 'Server error!',
          type: 'error',
          showConfirmButton: true,
        });
        console.log(err.error.ErrorMessage);
      }
    )
  }

  // Filter rooms selecting by Location
  filterrooms(num) {
    this.rooms = this.roomName.filter((item) => item.OrgId == num);
    console.log(this.rooms)
  }

  // Validate EndDate > BeginDate
  onBeginDateSelection(date: NgbDate) {
    if (date.after(this.toDate)) {
      Swal.fire({
        title: 'End Date must be later than Begin Date!',
        type: 'error',
        showConfirmButton: true,
      });
    } else {
      this.fromDate = date;
    }
  }
  onEndDateSelection(date: NgbDate) {
    if (date.before(this.fromDate)) {
      Swal.fire({
        title: 'End Date must be later than Begin Date!',
        type: 'error',
        showConfirmButton: true,
      });
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
      // Show selected data during editing
      groupObj = {
        CourseId: [this.whichCourseClass.CourseId, Validators.required],
        TeacherId: [this.whichCourseClass.TeacherId, Validators.required],
        BeginDate: [new Date(this.whichCourseClass.BeginDate), Validators.required],
        EndDate: [new Date(this.whichCourseClass.EndDate), Validators.required],
        OrgId: [this.whichCourseClass.OrgId, Validators.required],
        RoomId: [this.whichCourseClass.RoomId, Validators.required],
        CourseSchedule: this.fb.array([])
      }
    }
    return groupObj;
  }
  // Begin time Arrays
  formArrayAssemble() {
    return this.fb.group({
      BeginTime: [null, Validators.required],
      DayOfWeek: [null, Validators.required]
    })
  }
  formArrayAssembleUpdate() {
    for (var i = 0; i < this.whichCourseClass.schedule.length; i++) {
      // Transform this.updateForm.controls.CourseSchedule as FormArray, then push 
      (this.updateForm.controls.CourseSchedule as FormArray).push(
        this.fb.group({
          BeginTime: [this.whichCourseClass.schedule[i].BeginTime, Validators.required],
          DayOfWeek: [this.whichCourseClass.schedule[i].DayOfWeek, Validators.required]
        })
      );
    }
  }
  // add time
  newTime() {
    const sches = this.updateForm.controls.CourseSchedule as FormArray;
    sches.push(this.formArrayAssemble());
  }
  deleteTime(index) {
    const sches = this.updateForm.controls.CourseSchedule as FormArray;
    sches.removeAt(index);
  }

  /***** Post form ********************************************************/
  onSubmit() {
    let valueToSubmit = this.updateForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    if (vailadValue !== null && this.updateForm.dirty) {
      if (vailadValue.BeginDate > vailadValue.EndDate) {
        Swal.fire({
          title: 'End Date must be later than Begin Date!',
          type: 'error',
          showConfirmButton: true,
        });
        return;
      } else {
        this.submitionFlag = false;
        this.loadingGifFlag = true;
        this.submitByMode(vailadValue);
      }
    } else if (!this.updateForm.dirty) {
      this.errorMessage = 'Data did no changing!';
    } else {
      this.errorMessage = 'Please check your input.'
    }
  }

  // check whether data vailad or not(ruled by Validators).
  checkInputVailad(valueSubmit) {
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    console.log('checkInput', this.updateForm)
    for (let i in this.updateForm.controls) {
      this.updateForm.controls[i].touched == true;
    }
    if (this.updateForm.status == 'VALID') {
      if (this.command == 0) {
        return valueSubmit;
      } else {
        return this.prepareSubmitData(valueSubmit);
        // return valueSubmit;
      }
    }
    else {
      this.loadingGifFlag = false;
      this.messageColor = '#dc3545'
      this.submitionFlag = true;
      return null;
    }
  }

  prepareSubmitData(valueTo) {
    valueTo.BeginDate = this.datePipe.transform(this.updateForm.controls.BeginDate.value, 'yyyy-MM-dd');
    valueTo.EndDate = this.datePipe.transform(this.updateForm.controls.EndDate.value, 'yyyy-MM-dd');
    return valueTo;

  }

  // Add & Update new data 
  submitByMode(formValue) {
    //while push a stream of new data
    if (this.command == 0) {
      this.coursesService.addNewCourseClass(formValue).subscribe(
        (res) => {
          Swal.fire({
            title: 'Successfully Add!',
            type: 'success',
            showConfirmButton: true,
          });
          this.activeModal.close();
        },
        (err) => {
          this.backendErrorHandler(err);
        }
      );
    }
    //while update data
    else if (this.command == 2) {
      this.coursesService.updateCourseClass(formValue, this.whichCourseClass.GroupCourseInstanceId).subscribe(
        (res) => {
          Swal.fire({
            title: 'Successfully Modify!',
            type: 'success',
            showConfirmButton: true,
          });
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
