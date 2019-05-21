import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';
import { CoursesService } from '../../../../../services/http/courses.service';
import { NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-registration-form',
  templateUrl: './learner-registration-form.component.html',
  styleUrls: ['./learner-registration-form.component.css']
})
export class LearnerRegistrationFormComponent implements OnInit {
  // @Input() receivedParentMessage: any;
  // receivedChildMessage: any;
  public time: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  public hourStep = 1;
  public minuteStep = 15;
  public registrationForm: FormGroup; // define the type of registrationForm
  public selectedPhoto: File = null;
  public selectedGrade: File = null;
  public errorMsg: string; // display error message from server in template
  public postSuccessMsg: string; // display message to user when they posted data to server successfully
  public guitars: Array<any>;
  public pianos: Array<any>;
  public drums: Array<any>;
  public groupCourseInstance: Array<any>;
  public learnerPurpose: Array<any>;
  public howKnown: Array<any>;
  public locations: Array<any>;
  public levelType: Array<any>;
  public customCourseInstance: Array<any>;
  public customCourseRoom: Array<any>;
  public teacherLevel: Array<any>;
  public teacherName: Array<any>;
  //public selectedCourse: string;
  public isSelectedLevel: boolean = false;
  public learnerLevel: Array<any>;
  public fd = new FormData;
  public learner: any;
  public parent = [];
  public fdObj = {};
  public isGroupCourse: boolean = true;
  public isCustomCourse: boolean = false;
  public tempGroupCourseObj = {};
  public groupCourseInstanceId: number;
  public learnerGroupCourse: Array<any> = [];
  public selectedCheckbox: boolean;
  public newGroupCourse: Array<any>;
  public coursesCategory: any[];
  public courses: any[];
  public oneOnOneCourse: Array<any> = [];
  public courseTime: any;
  public learnerOthers: any[] = [];
  public learnerlevelType: any;
  public duration: Array<any>;
  public selectlearnerLevel: number;
  public pureCourses: any[];
  // validate errors
  getErrorW = false;
  getErrorH = false;
  showErrorW = false;
  showErrorH = false;
  touchNext = false;

  // getter method: simplify the way to capture form controls
  get firstName() { return this.registrationForm.get('learnerForm').get('firstName'); }
  get lastName() { return this.registrationForm.get('learnerForm').get('lastName'); }
  get gender() { return this.registrationForm.get('learnerForm').get('gender'); }
  get email() { return this.registrationForm.get('learnerForm').get('email'); }
  get learnerForm() { return this.registrationForm.get('learnerForm'); }
  get parentForm() { return this.registrationForm.get('parentForm') as FormArray; }
  get groupCourse() { return this.registrationForm.get('groupCourse') as FormArray; }
  get customCourse() { return this.registrationForm.get('customCourse') as FormArray; }

  constructor(
    private fb: FormBuilder,
    private registrationService: LearnerRegistrationService,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      learnerForm: this.fb.group({
        firstName: ['www', Validators.required],
        middleName: ['e'],
        lastName: ['li', Validators.required],
        gender: ['2', Validators.required],
        birthday: ['2018-01-01'],
        enrollmentDate: ['2018-12-21'],
        contactPhone: ['012345678'],
        email: ['jijoir@gamil.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        address: ['1188 Station'],
        photo: [''],
        grade: [''],
        learnPurpose: [''],
        infoFrom: [''],
        learnerLevel: [this.selectlearnerLevel],
        location: ['', Validators.required],
        levelType: [this.learnerlevelType],
        paymentPeriod: [''],
        referrer: ['']

      }),
      parentForm: this.fb.array([
        this.fb.group({
          firstName: ['uiy', Validators.required],
          lastName: ['ye', Validators.required],
          relationship: ['2', Validators.required],
          contactPhone: ['9989900', Validators.required],
          email: ['ivfkhhkn@gmail.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
        })
      ]),
      groupCourse: this.fb.array([]),
      customCourse: this.fb.array([
        this.fb.group({
          courseCategory: [''],
          course: [''],
          teacherName: [''],
          location: [''],
          room: [''],
          beginDate: [''],
          endDate: [''],
          schedule: this.fb.group({
            dayOfWeek: [''],
            beginTime: [this.time],
            durationType: ['']
          })
        })
      ]),
    });

    // // initialize card display
    document.getElementById('learnerForm').style.display = 'block';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'none';

    this.getGroupCourseFromServer();
    this.getLookups(1);
    this.getOrgs();
    this.getCustomCourseFromServer();
    this.toModel(this.time);
    this.getCoursesFromServer();
  }
  private pad(i: number): string {
    return i < 10 ? `0${i}` : `${i}`;
  }
  toModel(time: NgbTimeStruct): string {
    if (!time) {
      return null;
    } else {
      this.courseTime = `${this.pad(time.hour)}:${this.pad(time.minute)}:${this.pad(time.second)}`;
    }
  }
  // getMessage(message: any) {
  //   this.receivedChildMessage = message;
  // }
  // encapsulate files form data
  uploadPhoto(event: any) {
    this.selectedPhoto = <File>event.target.files[0];
    console.log('photo', this.selectedPhoto);
    this.fd.append('photo', this.selectedPhoto);
    let photoRender = this.selectedPhoto;
    let photoObj = document.querySelector('#photoID');
    let reader = new FileReader();
    reader.onloadend = function () {
      photoObj.setAttribute("src", this.result.toString());
    }
    reader.readAsDataURL(photoRender);
  }

  uploadGrade(event: any) {
    this.selectedGrade = <File>event.target.files[0];
    console.log('ABRSM', this.selectedGrade);
    this.fd.append('ABRSM', this.selectedGrade);
  }
  getCoursesFromServer() {
    this.coursesService.getCourses().subscribe(
      (data) => {
        this.pureCourses = data.Data;
        console.log('courses', this.pureCourses)
        this.coursesCategory = data.Data.map(item => item.CourseCategoryId)
          .map((e, i, final) => final.indexOf(e) === i && i)
          .filter(e => data.Data[e]).map(e => data.Data[e]);
        console.log('courses category', this.coursesCategory)
        // const unique = [... new Set(this.courses.map(item => item.CourseCategoryId))]
      })
  }
  getLookups(id: number) {
    // this.registrationService.getLookups(1)
    //   .subscribe(
    //     data => {
    //       console.log('teacher info', data);
    //       this.learnerPurpose = data.Data;
    //     },
    //     err => {
    //       console.log('teacher info err', err);
    //     }
    //   );
    this.registrationService.getLookups(2)
      .subscribe(
        data => {
          console.log('learner purpose', data);
          this.learnerPurpose = data.Data;
          for (let lP of this.learnerPurpose) {
            lP.isChecked = false;
          }
        },
        err => {
          console.log('learner purpose err', err);
        }
      );
    this.registrationService.getLookups(3)
      .subscribe(
        data => {
          console.log('how know', data);
          this.howKnown = data.Data;
          this.howKnown.map((o, i) =>
            o.isChecked = false)
        },
        err => {
          console.log('how know err', err);
        }
      );
    this.registrationService.getLookups(4)
      .subscribe(
        data => {
          console.log('learner level', data);
          this.learnerLevel = data.Data;
        },
        err => {
          console.log('learner level err', err);
        }
      );
    this.registrationService.getLookups(5)
      .subscribe(
        data => {
          console.log('level type', data);
          this.levelType = data.Data;
        },
        err => {
          console.log('level type err', err);
        }
      );
  }
  selectLearnerLevel(value) {
    this.isSelectedLevel = !this.isSelectedLevel;
    this.selectlearnerLevel = value;
    console.log('select learner level', value);
    // let a = this.courses.filter((e) =>  this.selectlearnerLevel == e.Level);
    this.courses = this.pureCourses.filter((e) => e.Level == this.selectlearnerLevel && e.CourseType == 1);
    console.log('courses filter', this.courses)

  }
  selectLearnerPurpose(i, event) {
    this.learnerPurpose[i].isChecked = event.target.checked;
    this.confirmLearner();
  }
  selectHowKnown(i, event) {
    this.howKnown[i].isChecked = event.target.checked;
    this.confirmLearner();
  }
  confirmLearner() {
    this.learnerOthers = []
    let whyP = [];
    let howP = [];
    for (let learnPurpose of this.learnerPurpose) {
      if (learnPurpose.isChecked) {
        let tempObj = {};
        tempObj['OthersType'] = learnPurpose.LookupType;
        tempObj['OthersValue'] = learnPurpose.PropValue;
        whyP.push(tempObj);

        console.log('whyP',whyP)
        // this.learnerOthers.push(tempObj);
      }
    }
    for (let how of this.howKnown) {
      if (how.isChecked) {
        let tempObj = {};
        tempObj['OthersType'] = how.LookupType;
        tempObj['OthersValue'] = how.PropValue;
        howP.push(tempObj);

        console.log('howP',howP)
        // this.learnerOthers.push(tempObj);
      }
    };
    whyP.length === 0 ? this.getErrorW = false : this.getErrorW = true;
    howP.length === 0 ? this.getErrorH = false : this.getErrorH = true;
    this.getErrorW === false?this.showErrorW = true:this.showErrorW=false;
    this.getErrorH === false?this.showErrorH = true:this.showErrorH=false;
    this.learnerOthers = whyP.concat(howP)
  }

  getGroupCourseFromServer() {
    this.registrationService.getGroupCourse().subscribe(
      data => {
        console.log('group course data', data.Data);
        this.groupCourseInstance = data.Data;
        for (let groupCourse of this.groupCourseInstance) {
          groupCourse.comments = null;
          groupCourse.isChecked = false;
        };
        console.log('new group course', this.groupCourseInstance)
        this.addCheckboxes();
      },
      err => {
        console.log('group course err', err);
      }
    )
  }
  addCheckboxes() {
    this.groupCourseInstance.map((o, i) => {
      const control = this.fb.control(false); // if first item set to true, else false
      this.groupCourse.push(control); // this.groupCourse as FormArray
    });
  }
  selectCheckboxes(i, event) {
    this.groupCourseInstance[i].isChecked = event.target.checked;
  }
  confirmGroupCourse() {
    this.learnerGroupCourse = []
    for (let groupCourse of this.groupCourseInstance) {
      if (groupCourse.isChecked) {
        this.tempGroupCourseObj = {};
        this.tempGroupCourseObj['GroupCourseInstanceId'] = groupCourse.GroupCourseInstanceId;
        this.tempGroupCourseObj['Comment'] = groupCourse.comments;
        this.learnerGroupCourse.push(this.tempGroupCourseObj);
      }
    }
  }
  getCustomCourseFromServer() {
    this.registrationService.getTeacherFilter().subscribe(
      (data) => {
        this.customCourseInstance = data.Data;
        console.log('teacher filter', this.customCourseInstance);
      },
      (err) => {
        console.log('teacher filer err', err);
      }
    )
  }
  selectLocation(i: number) {
    // console.log('location i', i);
    this.registrationService.getTeacherFilter().subscribe(
      (data) => {
        let tempArray = data.Data.filter((item) => (item.OrgId - 1) == i);
        this.customCourseRoom = tempArray[0].Room;
        console.log('filterArray', tempArray);
        console.log('Room', this.customCourseRoom);
        this.teacherLevel = tempArray[0].Level;
        console.log('teacherLevel', this.teacherLevel);
      }
    )
  }
  selectTl(i: number) {
    // console.log('teacherlevel i', i);
    let tempArray = this.teacherLevel.filter((item) => (item.levelId - 1) == i);
    this.teacherName = tempArray[0].teacher;
    console.log('teacherName', this.teacherName)
  }
  selectLevelType(value) {
    this.learnerlevelType = value;
    console.log('learner type', this.learnerlevelType)
  }
  selectCourse(value) {

  }
  confirmCustomCourse() {
    let cs = this.customCourse.value;
    console.log('custom Course Form value', cs);
    // let tempObj = {};
    for (let cc of this.customCourse.value) {
      let tempObj = {};
      tempObj['CourseId'] = parseInt(cc.course);
      tempObj['OrgId'] = cc.location;
      tempObj['TeacherId'] = parseInt(cc.teacherName);
      tempObj['RoomId'] = parseInt(cc.room);
      tempObj['BeginDate'] = cc.beginDate;
      let tempScheduleObj = {};
      tempScheduleObj['DayOfWeek'] = cc.schedule.dayOfWeek;
      tempScheduleObj['BeginTime'] = this.courseTime;
      tempScheduleObj['DurationType'] = parseInt(cc.course);
      tempObj['Schedule'] = tempScheduleObj;
      this.oneOnOneCourse.push(tempObj);
    };
    console.log('oneOnOne', this.oneOnOneCourse);
  }
  getOrgs() {
    this.registrationService.getOrgs()
      .subscribe(
        data => {
          console.log('orgs', data);
          this.locations = data.Data;
        },
        err => {
          console.log('orgs', err);
        }
      )
  }
  onSubmit() {
    // encapsulate learner form data
    this.learner = this.learnerForm.value;
    this.fdObj['FirstName'] = this.learner.firstName;
    // this.fdObj['MiddleName']=this.learner.middleName;
    this.fdObj['LastName'] = this.learner.firstName;
    this.fdObj['Gender'] = this.learner.gender;
    this.fdObj['dob'] = this.learner.birthday;
    // this.fdObj['DateOfEnrollment']= this.learner.enrollmentDate;
    this.fdObj['ContactPhone'] = this.learner.contactPhone;
    this.fdObj['Email'] = this.learner.email;
    this.fdObj['Address'] = this.learner.address;
    this.fdObj['OrgId'] = this.learner.location;
    this.fdObj['LearnerLevel'] = this.selectlearnerLevel;
    this.fdObj['LevelType'] = this.learnerlevelType;
    // encapsulate parent form data
    // console.log('submit', this.parentForm.value)
    for (let parent of this.parentForm.value) {
      let parentTempObj = {};
      parentTempObj['FirstName'] = parent.firstName;
      parentTempObj['LastName'] = parent.lastName;
      parentTempObj['Relationship'] = Number(parent.relationship);
      parentTempObj['ContactNum'] = parent.contactPhone;
      parentTempObj['Email'] = parent.email;
      this.parent.push(parentTempObj);
      // console.log('parent',this.parent);
    }
    this.fdObj['Parent'] = this.parent;
    this.fdObj['LearnerGroupCourse'] = this.learnerGroupCourse;
    this.fdObj['One2oneCourseInstance'] = this.oneOnOneCourse;
    this.fdObj['LearnerOthers'] = this.learnerOthers;
    this.fd.append('details', JSON.stringify(this.fdObj));
    console.log('form data', this.fdObj)
    this.registrationService.postStudent(this.fd)
      .subscribe(
        data => {
          this.postSuccessMsg = data;
          console.log('Success!', data);
        },
        error => {
          this.errorMsg = error;
          console.log('Error!', error);
        }
      )
  }
  resetLearner() {
    this.learnerForm.reset();
  }
  resetParent() {
    this.parentForm.reset();
  }
  deleteParent(i: number) {
    this.parentForm.removeAt(i);
  }
  addParent() {
    this.parentForm.push(
      this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        relationship: ['', Validators.required],
        contactPhone: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
      })
    );
    // console.log('addParent', this.parentForm.value)
  }
  resetCustomCourse() {
    this.customCourse.reset();
  }
  deleteCustomCourse(i: number): void {
    this.customCourse.removeAt(i);
  }
  addCustomCourse(): void {
    this.customCourse.push(
      this.fb.group({
        courseCategory: [''],
        course: [''],
        teacherName: [''],
        location: [''],
        room: [''],
        beginDate: [''],
        endDate: [''],
        schedule: this.fb.group({
          dayOfWeek: [''],
          beginTime: [this.time],
          durationType: ['']
        })
      })
    );
  }
  chooseGroupCourse() {
    this.isGroupCourse = true;
    this.isCustomCourse = false;
  }
  chooseCustomCourse() {
    this.isCustomCourse = true;
    this.isGroupCourse = false;
  }

  next(value: string) {
    this.getErrorW === false?this.showErrorW = true:this.showErrorW=false;
    this.getErrorH === false?this.showErrorH = true:this.showErrorH=false;
    this.touchNext = true;
    if (value === 'parentForm') { this.confirmLearner(); }
    if ((this.getErrorH === true) && (this.getErrorW === true)){
      this.showErrorW = false;
      this.showErrorH = false;
      this.touchNext = false;
      document.getElementById('learnerForm').style.display = 'none';
      document.getElementById('parentForm').style.display = 'none';
      document.getElementById('courseForm').style.display = 'none';
      document.getElementById(value).style.display = 'block';}
  }
}

