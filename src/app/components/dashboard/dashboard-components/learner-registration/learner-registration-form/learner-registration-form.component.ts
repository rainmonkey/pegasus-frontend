import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';
import { CoursesService } from '../../../../../services/http/courses.service';
import { NgbTimeStruct, NgbTimeAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerRegistrationModalComponent } from '../learner-registration-modal/learner-registration-modal.component';
import { LearnerRegistrationConfirmModalComponent } from '../learner-registration-confirm-modal/learner-registration-confirm-modal.component';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { concat } from 'rxjs';
import { element } from '@angular/core/src/render3';
import { forkJoin } from 'rxjs';
import { TimePickerComponent } from '../../time-picker/time-picker.component';
import { ngtimepickerValidator } from './validators';

@Component({
  selector: 'app-learner-registration-form',
  templateUrl: './learner-registration-form.component.html',
  styleUrls: ['./learner-registration-form.component.css']
})
export class LearnerRegistrationFormComponent implements OnInit, DoCheck {
  // @Input() receivedParentMessage: any;
  // receivedChildMessage: any;
  // courseIntanceGroup: FormGroup;
  @Input() whichLearner;

  public time: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  public hourStep = 1;
  public minuteStep = 15;
  public registrationForm: FormGroup; // define the type of registrationForm
  public selectedPhoto: File = null;
  public selectedGrade: File = null;
  selectedAgreement: File = null;
  selectedOther: File = null;
  orgId;
  public errorMsg: string; // display error message from server in template
  public guitars: Array<any>;
  public pianos: Array<any>;
  public drums: Array<any>;
  public groupCourseInstance: Array<any>;
  public learnerPurpose: Array<any>;
  public howKnown: Array<any>;
  public locations: Array<any>;
  public levelType: Array<any>;
  public customCourseInstance: Array<any>;
  public teacherLevel: Array<any>;
  public teacherName: Array<any>;
  //public selectedCourse: string;
  public isSelectedLevel: boolean = false;
  public learnerLevel: Array<any>;
  public fd = new FormData;
  public learner: any;
  public parent = [];
  public fdObj = {};
  public isGroupCourse: boolean = false;
  public isCustomCourse: boolean = true;
  public tempGroupCourseObj = {};
  public groupCourseInstanceId: number;
  public learnerGroupCourse: Array<any> = [];
  public selectedCheckbox: boolean;
  public newGroupCourse: Array<any>;
  public coursesCategory = [];
  public courses = [];
  public oneOnOneCourse: Array<any> = [];
  public courseTime: any;
  public learnerOthers: any[] = [];
  public learnerlevelType = 1;
  public duration: Array<any>;
  public selectlearnerLevel: number;
  public pureCourses: any[];
  notPiano;
  notPianoTeaArray = [];
  // isUnder18 = 0;
  myDate;
  public;
  courses121;
  courseTemp;
  courseLocation;
  // subscribe errors
  errorMsgSub;
  errorAlert = false;
  // validate errors
  getErrorW = false;
  getErrorH = false;
  showErrorW = false;
  showErrorH = false;
  touchNext = false;
  // photo thumbnail
  photoObj;
  // for add more selection
  setUniCat = [];
  setUniCatListArray = [];
  catListArray = [];
  catItemArray = [];
  locListArray = [];
  locItemArray = [];
  prepareTeaLevListArray = [];
  prepareTeaLevItemArray = [];
  selectedprepareTeaLevInOrgObjItemArray = [];
  selectedprepareTeaLevInOrgObjListArray = [];
  prepareTeaNameInLevObjItemArray = [];
  prepareTeaNameInLevObjListArray = [];
  courseItemArray = [];
  courseListArray = [];
  selectedLocItemArray = [];
  selectedLocListArray = [];
  prepareRoomItemArray = [];
  prepareRoomListArray = [];
  prepareTeaNameListArray = [];
  prepareTeaNameItemArray = [];
  // active modal
  modalRefTimePicker;
  timePickArrayNumber;
  modalRefConfirm;
  // needSubmit = false;

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
    private modalService: NgbModal
  ) { }
  get courseGroup(): FormGroup {
    return this.fb.group({
      courseId: [''],
      courseCategory: ['']
    });
  }
  get courseIntanceGroup(): FormGroup {
    return this.fb.group({
      courseCategory: ['',Validators.required],
      course: ['',Validators.required],
      teacherLevel: [''],
      teacherName: ['',Validators.required],
      location: [''],
      room: ['',Validators.required],
      beginDate: [this.myDate()],
      endDate: [''],
      schedule: this.fb.group({
        dayOfWeek: ['6'],
        beginTime: [this.time, ngtimepickerValidator],
        durationType: ['']
      }),
    });
  }
//
  ngOnInit() {
    // init date
    // get orgId
    this.orgId = JSON.parse(localStorage.getItem('OrgId'))[0];
    this.getDate();
    if (this.whichLearner != null) { //set LevelType
      console.log(this.whichLearner);
      this.learnerlevelType  = this.whichLearner.LevelType;
    }
    this.registrationForm = this.fb.group({
      learnerForm: this.fb.group({
        firstName: [this.whichLearner ? this.whichLearner.FirstName : '', Validators.required],
        middleName: [this.whichLearner ? this.whichLearner.MiddleName : ''],
        lastName: [this.whichLearner ? this.whichLearner.LastName : '', Validators.required],
        gender: [this.whichLearner ? this.whichLearner.Gender : '2', Validators.required],

        birthday: [this.whichLearner && this.whichLearner.Dob ? this.whichLearner.Dob.slice(0, 10) : null],
        enrollmentDate: [this.whichLearner&&this.whichLearner.EnrollDate ? this.whichLearner.EnrollDate.slice(0, 10) : this.myDate()],

        contactNum: [this.whichLearner ? this.whichLearner.ContactNum : ''],
        email: [this.whichLearner ? this.whichLearner.Email : '', [Validators.required, Validators.email]],
        address: [this.whichLearner ? this.whichLearner.Address : ''],
        photo: [''],
        grade: [''],
        //learnPurpose: [this.whichLearner?this.whichLearner.learnPurpose:''],
        //infoFrom: [this.whichLearner?this.whichLearner.infoFrom:''],
        learnerLevel: [this.whichLearner ? this.whichLearner.LearnerLevel : this.selectlearnerLevel, Validators.required],
        location: [this.whichLearner ? this.whichLearner.OrgId : this.orgId, Validators.required],
        levelType: [this.whichLearner ? this.whichLearner.LevelType : '0'],
        levelTypeRadio: [1],
        paymentPeriod: [this.whichLearner ? this.whichLearner.PaymentPeriod : '1'],
        referrer: [this.whichLearner ? this.whichLearner.Referrer : ''],
        isUnder18: [this.whichLearner ? this.whichLearner.isUnder18 : 0],
      }),
      parentForm: this.fb.array([]),
      groupCourse: this.fb.array([]),
      customCourse: this.fb.array([]),
    });

   
    this.setParentForm();
    this.setOneToOneForm();


    //@ts-ignore
    // let abc = this.customCourse.controls[0].controls.roomArray;

    // initialize card display
    document.getElementById('learnerForm').style.display = 'block';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'none';

    if (!this.whichLearner) this.getGroupCourseFromServer();
    this.getLookups(1);
    this.toModel(this.time);
    this.getLocationFromServer();
    // init array
    this.initArrays()

    //
    console.log(this.registrationForm);
  }

  getDate() {
    this.myDate = () => {
      const Dates = new Date();
      const year: number = Dates.getFullYear();
      const month: any = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
      const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
//      console.log( Dates, year, month,)
      return year + '-' + month + '-' + day;
    };
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
    this.fd.append('photo', this.selectedPhoto);
    let photoRender = this.selectedPhoto;
    this.photoObj = document.querySelector('#photoID');
    let that = this;
    let reader = new FileReader();
    reader.onloadend = function () {
      that.photoObj.setAttribute("src", this.result.toString());
    }
    reader.readAsDataURL(photoRender);
  }

  uploadGrade(event: any) {
    this.selectedGrade = <File>event.target.files[0];
    this.fd.append('ABRSM', this.selectedGrade);
    let photoRender = this.selectedGrade;
    this.photoObj = document.querySelector('#certificate');
    let that = this;
    let reader = new FileReader();
    reader.onloadend = function () {
      console.log(this.result)
      that.photoObj.setAttribute("src", this.result.toString());
    }
    reader.readAsDataURL(photoRender);
  }

  uploadAgreement(event) {
    this.selectedAgreement = <File>event.target.files[0];
    this.fd.append('form', this.selectedAgreement);
  }

  uploadOther(event) {
    this.selectedOther = <File>event.target.files[0];
    this.fd.append('OtherFile', this.selectedOther);
  }

  getCoursesFromServer() {
    this.coursesService.getCourses().subscribe(
      (res) => {
        this.pureCourses = res.Data;
        // get one to one courses
        this.courses121 = res.Data.filter(item => item.CourseType === 1);
        // apply learner level filter
        console.log(this.selectlearnerLevel)

        let coursePiano = this.courses121.filter(item => item.CourseCategory.CourseCategoryId === 1)
          .filter((item) => item.Level == this.selectlearnerLevel);
        console.log(this.selectlearnerLevel, coursePiano);
        // if not piano, do not filter the learner level
        let courseOther = this.courses121.filter(item => item.CourseCategory.CourseCategoryId !== 1);
        this.catItemArray = coursePiano.concat(courseOther);
        console.log(this.catItemArray);
        // this.catItemArray = this.courses121.filter((item) => item.Level === 0);
        // push item to list
        this.catListArray = [];
        this.catListArray.push(this.catItemArray);

        console.log('aaaa', this.catItemArray)
        let catArray = [];
        // let catNameArray = [];
        // let setUniName = [];
        let temp;
        let tempArray = [];
        this.catItemArray.forEach(cat => {
          // cat.CourseCategory.CourseCategoryId =
          // catArray.push(cat.CourseCategory.CourseCategoryId);
          // catNameArray.push(cat.CourseCategory.CourseCategoryName);
          catArray.push(JSON.stringify(cat.CourseCategory));
        });
        let uniCat = arr => Array.from(new Set(arr));
        this.setUniCat = [];
        uniCat(catArray).forEach(ele => {
          //@ts-ignore
          this.setUniCat.push(JSON.parse(ele));
        });
        // setUniName = uniCat(catNameArray);
        // setUniName.forEach((name, i) => {
        //   temp =
        //     {
        //       CourseCategoryId: this.setUniCat[i],
        //       CourseCategoryName: name
        //     }
        //   tempArray.push(temp)
        // })
        // this.setUniCat = tempArray;
        console.log(this.setUniCat);
        this.setUniCatListArray = [];
        this.setUniCatListArray.push(this.setUniCat);
        console.log(this.setUniCatListArray)
      });
  }
  getLocationFromServer() {
    this.coursesService.getOrgs().subscribe(
      (res) => {
        this.locations = res['Data'];
      }
    )
  }
  getLookups(id: number) {
    this.registrationService.getLookups(1)
      .subscribe(
        data => {
          console.log('teacher level', data);
          this.teacherLevel = data.Data;
        },
        err => {
          console.log('teacher info err', err);
        }
      );
    this.registrationService.getLookups(2)
      .subscribe(
        data => {
          console.log('learner purpose');
          this.learnerPurpose = data.Data;
          for (let lP of this.learnerPurpose) {
            lP.isChecked = false;
            if (this.whichLearner != null) {  //for edit
              if (this.whichLearner.LearnerOthers.filter(e => (
                e.OthersType == '2' && e.OthersValue == lP.PropValue)).length > 0)
                lP.isChecked = true;
            }
          }
        },
        err => {
          console.log('learner purpose err', err);
        }
      );
    this.registrationService.getLookups(3)
      .subscribe(
        data => {
          console.log('how know', data, this.whichLearner);
          this.howKnown = data.Data;
          this.howKnown.map((o, i) => {
            o.isChecked = false;
            if (this.whichLearner != null) {  //for edit
              if (this.whichLearner.LearnerOthers.filter(e => (
                e.OthersType == '3' && e.OthersValue == o.PropValue)).length > 0)
                o.isChecked = true;
            }
          })
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
          console.log('level type', this.levelType)
        },
        err => {
          console.log('level type err', err);
        }
      );
  }
  selectLearnerLevel(value) {
    if (this.whichLearner) return 
    this.customCourse.reset();
    this.customCourse.controls.forEach((item, index) => {
      this.customCourse.removeAt(index);
    });
    this.customCourse.push(this.courseIntanceGroup)
    this.isSelectedLevel = true;
    this.selectlearnerLevel = value;
    this.getCoursesFromServer();
    // let a = this.courses.filter((e) =>  this.selectlearnerLevel == e.Level);

  }
  // check lists
  // select18(event){
    // if (event.target.checked){
    //   this.isUnder18 = 1;
    // }
    // console.log(this.learnerForm.value.isUnder18)
  // }

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

        // this.learnerOthers.push(tempObj);
      }
    }
    for (let how of this.howKnown) {
      if (how.isChecked) {
        let tempObj = {};
        tempObj['OthersType'] = how.LookupType;
        tempObj['OthersValue'] = how.PropValue;
        howP.push(tempObj);
        // this.learnerOthers.push(tempObj);
      }
    };
    whyP.length === 0 ? this.getErrorW = false : this.getErrorW = true;
    howP.length === 0 ? this.getErrorH = false : this.getErrorH = true;
    this.getErrorW === false ? this.showErrorW = true : this.showErrorW = false;
    this.getErrorH === false ? this.showErrorH = true : this.showErrorH = false;
    this.learnerOthers = whyP.concat(howP)
  }
  // group course section
  getGroupCourseFromServer() {
    this.registrationService.getGroupCourse().subscribe(
      data => {
        console.log('group course data', data.Data);
        this.groupCourseInstance = data.Data;
        for (let groupCourse of this.groupCourseInstance) {
          groupCourse.comments = null;
          groupCourse.isChecked = false;
          groupCourse.beginDate = this.myDate().slice(0,10);
        };
        console.log('new group course', this.groupCourseInstance)
        // this.addCheckboxes();
      },
      err => {
        console.log('group course err', err);
      }
    )
  }
  // addCheckboxes() {
  //   this.groupCourseInstance.map((o, i) => {
  //     // const control = this.fb.control(false); // if first item set to true, else false
  //     this.groupCourse.push(control); // this.groupCourse as FormArray
  //   });
  // }
  selectCheckboxes(i, event) {
    this.groupCourseInstance[i].isChecked = event.target.checked;
  }
  confirmGroupCourse() {
    console.log('wo yao jia ji tui', this.groupCourseInstance)
    for (let groupCourse of this.groupCourseInstance) {
      if (groupCourse.isChecked) {
        this.tempGroupCourseObj = {};
        this.tempGroupCourseObj['GroupCourseInstanceId'] = groupCourse.GroupCourseInstanceId;
        this.tempGroupCourseObj['Comment'] = groupCourse.comments;
        this.tempGroupCourseObj['BeginDate'] = groupCourse.beginDate;
        this.learnerGroupCourse.push(this.tempGroupCourseObj);
      }
    }
  }

  // 121 course section
  // selectLevelType(value) {
  //   console.log(this.levelType)
  //   console.log(value)    
  //   this.learnerlevelType = Number(value);
  // }
  emptySelectionCat(i) {

    this.customCourse.controls[i].patchValue({
      course: '',
      teacherName: '',
      teacherLevel: '',
      location: '',
      room: '',
    })
    console.log(this.customCourse)
    this.courseListArray[i].courseItemArray = [];
    this.selectedLocListArray[i].selectedLocItemArray = [];
    this.prepareTeaLevListArray[i].prepareTeaLevItemArray = [];
    this.prepareRoomListArray[i].prepareRoomItemArray = [];
    this.prepareTeaNameListArray[i].prepareTeaNameItemArray = [];
  }
  emptySelectionCour(i) {

    this.customCourse.controls[i].patchValue({
      teacherName: '',
      teacherLevel: '',
      location: '',
      room: '',
    })
    this.selectedLocListArray[i].selectedLocItemArray = [];
    this.prepareTeaLevListArray[i].prepareTeaLevItemArray = [];
    this.prepareRoomListArray[i].prepareRoomItemArray = [];
    this.prepareTeaNameListArray[i].prepareTeaNameItemArray = [];
  }

  // select course category
  selectCategory(id, i) {
    // let courseTemp = [];
    this.emptySelectionCat(i);
    this.notPiano = id;
    this.courseListArray[i].courseItemArray = this.catListArray[i].filter(item => item.CourseCategoryId === Number(id));
    console.log("this.courseListArray", this.courseListArray);
  }

  selectCourse(value, i) {
    this.emptySelectionCour(i)
    this.locListArray[i].locItemArray = [];
    return this.registrationService.getTeacherFilter(value).subscribe(
      res => {
        this.locListArray[i].locItemArray = res.Data;
        console.log(this.locItemArray);
        // if (this.whichLearner)
        //     this.selectLocation(this.whichLearner.One2oneCourseInstance[i].OrgId, i);

      }, error => {
        this.locListArray[i].locItemArray = [];
        this.errorMsgSub = JSON.parse(error.error);
        console.log("Error!", this.errorMsgSub.ErrorCode);
        this.errorAlert = true;
      }
    );
  }
selectLocation(id, i) {
    // filter branch
    this.selectedLocListArray[i].selectedLocItemArray = this.locListArray[i].locItemArray.filter(item => item.OrgId == id);
    // get level value
    this.prepareTeaLevListArray[i].prepareTeaLevItemArray = this.selectedLocListArray[i].selectedLocItemArray[0].Level;
    // get room value
    this.prepareRoomListArray[i].prepareRoomItemArray = this.selectedLocListArray[i].selectedLocItemArray[0].Room;
    // if piano apply teacher level, else not apply
    if (this.notPiano !== 1) {
      // empty array;
      this.notPianoTeaArray = [];
      this.prepareTeaLevListArray[i].prepareTeaLevItemArray.forEach(ele => {
        this.notPianoTeaArray = this.notPianoTeaArray.concat(ele.teacher);
      });
      this.prepareTeaNameListArray[i].prepareTeaNameItemArray = this.notPianoTeaArray;
    }
    console.log(this.selectedLocListArray[i]);
    console.log(this.prepareTeaNameListArray[i]);
    console.log(this.prepareTeaLevListArray[i]);
    console.log(this.prepareRoomListArray[i]);
  }
  selectTl(id, i) {
    console.log(i, this.selectedprepareTeaLevInOrgObjListArray)
    console.log('prepareTeaLevItemArray', i, this.prepareTeaLevListArray[i].prepareTeaLevItemArray);
    // if not piano, do not filter the teacher level

    let teaList = this.prepareTeaLevListArray[i].prepareTeaLevItemArray.filter((item) => item.levelId == id);
    this.selectedprepareTeaLevInOrgObjListArray[i].selectedprepareTeaLevInOrgObjItemArray = teaList;
    this.prepareTeaNameListArray[i].prepareTeaNameItemArray = teaList[0].teacher;
    console.log(this.selectedprepareTeaLevInOrgObjListArray[i].selectedprepareTeaLevInOrgObjItemArray)
  }
  // init Array
  initArrays() {
    this.courseItemArray = [];
    this.locItemArray = [];
    this.selectedLocItemArray = [];
    this.prepareRoomItemArray = [];
    this.prepareTeaLevItemArray = [];
    this.selectedprepareTeaLevInOrgObjItemArray = [];
    this.prepareTeaNameInLevObjItemArray = [];
    this.prepareTeaNameItemArray = [];

    this.courseListArray.push(this.courseItemArray)
    this.locListArray.push(this.locItemArray);
    this.selectedLocListArray.push(this.selectedLocItemArray);
    this.prepareRoomListArray.push(this.prepareRoomItemArray);
    this.prepareTeaLevListArray.push(this.prepareTeaLevItemArray);
    this.selectedprepareTeaLevInOrgObjListArray.push(this.selectedprepareTeaLevInOrgObjItemArray);
    this.prepareTeaNameInLevObjListArray.push(this.prepareTeaNameInLevObjItemArray);
    this.prepareTeaNameListArray.push(this.prepareTeaNameItemArray);
  }
  confirmCustomCourse() {
    let cs = this.customCourse.value;
    console.log('custom Course Form value', cs);
    // let tempObj = {};
    for (let cc of this.customCourse.value) {
      if (cc.course===''||!cc.course) continue;
      let tempObj = {};
      tempObj['CourseId'] = parseInt(cc.course);
      tempObj['OrgId'] = cc.location;
      tempObj['TeacherId'] = parseInt(cc.teacherName);
      tempObj['RoomId'] = parseInt(cc.room);
      tempObj['BeginDate'] = cc.beginDate;
      let tempScheduleObj = {};
      tempScheduleObj['DayOfWeek'] = parseInt(cc.schedule.dayOfWeek);
      tempScheduleObj['BeginTime'] = cc.schedule.beginTime.hour + ':' + cc.schedule.beginTime.minute + ':' + cc.schedule.beginTime.second;//this.courseTime;
      tempScheduleObj['DurationType'] = parseInt(cc.course);
      tempObj['Schedule'] = tempScheduleObj;
      this.oneOnOneCourse.push(tempObj);
      console.log('oneOnOne', this.oneOnOneCourse);
    };
  }

  onSubmit() {
    this.confirmGroupCourse();
    this.confirmCustomCourse();
    console.log(this.courseGroup);
    // encapsulate learner form data
    this.learner = [];
    this.learner = this.learnerForm.value;
    console.log(this.learner);
    this.fdObj['FirstName'] = this.learner.firstName;
    this.fdObj['MiddleName'] = this.learner.middleName;
    this.fdObj['LastName'] = this.learner.lastName;
    this.fdObj['Gender'] = this.learner.gender;
    this.fdObj['dob'] = this.learner.birthday == null? null: this.learner.birthday;
    this.fdObj['EnrollDate'] = this.learner.enrollmentDate;
    this.fdObj['ContactNum'] = this.learner.contactNum;
    this.fdObj['Email'] = this.learner.email;
    this.fdObj['Address'] = this.learner.address;
    this.fdObj['OrgId'] = this.learner.location;
    this.fdObj['LearnerLevel'] = this.selectlearnerLevel;
    this.fdObj['LevelType'] = this.learnerlevelType;
    this.fdObj['IsUnder18'] = this.learner.isUnder18 ? 1 : 0;;
    this.fdObj['PaymentPeriod'] = parseInt(this.learner.paymentPeriod);
    this.fdObj['Referrer'] = this.learner.referrer;
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
    console.log(this.fdObj);
    this.fd.append('details', JSON.stringify(this.fdObj));
    // console.log('form data', this.fd);
    // active modal waiting for decision
    this.openConfirm();
  }
  resetLearner() {
    this.learnerForm.reset();
    if (this.photoObj)
      this.photoObj.setAttribute('src', null);
  }
  resetParent() {
    this.parentForm.reset();
  }
  deleteParent(i) {
    this.parentForm.removeAt(i);
  }
  addParent() {
    this.parentForm.push(
      this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        relationship: ['', Validators.required],
        contactPhone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      })
    );
    // console.log('addParent', this.parentForm.value)
  }
  resetCustomCourse(i) {
    this.customCourse.controls[i].reset();

    this.courseListArray[i].courseItemArray = [];
    this.locListArray[i].locItemArray = [];
    this.selectedLocListArray[i].selectedLocItemArray = [];
    this.prepareRoomListArray[i].prepareRoomItemArray = [];
    this.prepareTeaLevListArray[i].prepareTeaLevItemArray = [];
    this.selectedprepareTeaLevInOrgObjListArray[i].selectedprepareTeaLevInOrgObjItemArray = [];
    this.prepareTeaNameInLevObjListArray[i].prepareTeaNameInLevObjItemArray = [];
    this.prepareTeaNameListArray[i].prepareTeaNameItemArray = [];

  }
  deleteCustomCourse(i) {
    this.customCourse.removeAt(i);
    this.courseListArray.splice(i, 1);
    this.locListArray.splice(i, 1);
    this.prepareTeaLevListArray.splice(i, 1);
    this.selectedLocListArray.splice(i, 1);
    this.prepareRoomListArray.splice(i, 1);
    this.selectedprepareTeaLevInOrgObjListArray.splice(i, 1);
    this.prepareTeaNameInLevObjListArray.splice(i, 1);
    this.prepareTeaNameListArray.splice(i, 1);

    this.catListArray.splice(i, 1);
  }
  addCustomCourse(): void {
    this.emptyForAddButton();
    // add arrays
    this.customCourse.push(this.courseIntanceGroup);
    this.catListArray.push(this.catItemArray);
    this.setUniCatListArray.push(this.setUniCat);
    // add arrays for select options
    this.initArrays();
    console.log(this.customCourse.value)
  }
  // empty array for add more selection button
  emptyForAddButton() {
    this.courseItemArray = [];
    this.locItemArray = [];
    this.selectedLocItemArray = [];
    this.prepareRoomItemArray = [];
    this.prepareTeaLevItemArray = [];
    this.selectedprepareTeaLevInOrgObjItemArray = [];
    this.prepareTeaNameInLevObjItemArray = [];
    this.prepareTeaNameItemArray = [];
  }
  //ng-activeModal for time picker
  open(i) {
    this.modalRefTimePicker = this.modalService.open(LearnerRegistrationModalComponent, { windowClass: 'my-class' });
    this.modalRefTimePicker.componentInstance.customCourse = this.customCourse.value[i];
    this.timePickArrayNumber = i;
  }

  // // ng-activeModal for confirm submit
  openConfirm() {
    this.modalRefConfirm = this.modalService.open(LearnerRegistrationConfirmModalComponent);
    this.modalRefConfirm.componentInstance.fdObj = this.fd;
    if (this.whichLearner){
      this.modalRefConfirm.componentInstance.command = 2;  //add
      this.modalRefConfirm.componentInstance.learnerId = this.whichLearner.LearnerId;
    }
    else
      this.modalRefConfirm.componentInstance.command = 1;   //post

  }
  // // check changes
  ngDoCheck() {
     console.log(this.selectlearnerLevel)
    // console.log(this.customCourse.controls[0].get('schedule').get('beginTime').invalid)
    // console.log(this.modalRefTimePicker);
    // this.modalRefConfirm?this.needSubmit = this.modalRefConfirm.componentInstance.submitClicked:this.needSubmit = false;
    // console.log(this.needSubmit)
    // this.onSubmit()
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
    this.getErrorW === false ? this.showErrorW = true : this.showErrorW = false;
    this.getErrorH === false ? this.showErrorH = true : this.showErrorH = false;
    this.touchNext = true;
    if (value === 'parentForm') { this.confirmLearner(); }
    if ((this.getErrorH === true) && (this.getErrorW === true)) {
      this.showErrorW = false;
      this.showErrorH = false;
      this.touchNext = false;
      document.getElementById('learnerForm').style.display = 'none';
      document.getElementById('parentForm').style.display = 'none';
      document.getElementById('courseForm').style.display = 'none';
      document.getElementById(value).style.display = 'block';
    }
  }
  setParentForm() {
    if (!this.whichLearner) {
      this.parentForm.push(
        this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          relationship: ['', Validators.required],
          contactPhone: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        })
      );
    }
    else {
      this.whichLearner.Parent.map(p => {
        this.parentForm.push(
          this.fb.group({
            firstName: [p.FirstName, Validators.required],
            lastName: [p.LastName, Validators.required],
            relationship: [p.Relationship, Validators.required],
            contactPhone: [p.ContactNum, Validators.required],
            email: [p.Email, [Validators.required, Validators.email]]

          }))
      })
    };

  }
  setOneToOneForm(){
    if  (!this.whichLearner){
      this.customCourse.push(this.courseIntanceGroup);
       }
    else
    {
      if (this.whichLearner.One2oneCourseInstance.length===0){
        this.customCourse.push(this.courseIntanceGroup);
      }

      this.isSelectedLevel = true;
      this.selectlearnerLevel = this.whichLearner.LearnerLevel;

      let allData,teacherFilter,pureCourses;
      let CatList=[];
      this.setUniCatListArray=new Array();
      this.courseListArray=new Array();
      this.locListArray=new Array();
      this.prepareTeaLevListArray=new Array();
      this.prepareTeaNameListArray=new Array();
      this.prepareRoomListArray=new Array();

      let funArr=[];
      funArr.push(this.coursesService.getCourses());
      funArr.push(this.registrationService.getGroupCourse());
      this.whichLearner.One2oneCourseInstance.forEach(e=>{
        funArr.push(this.registrationService.getTeacherFilter(e.CourseId));
      })
      //funArr.push(this.registrationService.getTeacherFilter(this.whichLearner.One2oneCourseInstance[0].CourseId));
      forkJoin(...funArr).subscribe(
        (res) => {
          pureCourses = res[0].Data;
          this.groupCourseInstance = res[1].Data;
          allData = res;

          console.log(pureCourses,allData)
          pureCourses.forEach(e=>{
            //console.log(e);
            if (CatList.findIndex(c => c.CourseCategoryId === e.CourseCategory.CourseCategoryId) < 0)
              CatList.push(e.CourseCategory);
          });
          console.log(CatList);

          //groupCourse
          console.log(this.whichLearner.LearnerGroupCourse,this.groupCourseInstance);
          this.groupCourseInstance.forEach(g=>{
              let foundGroupCourse=this.whichLearner.LearnerGroupCourse.find(e=>
                e.GroupCourseInstanceId===g.GroupCourseInstanceId
              );

            if (foundGroupCourse){
              g.isChecked = true;
              g.comments = foundGroupCourse.Comment;
              g.beginDate = foundGroupCourse.BeginDate.slice(0,10);
            }else{
              g.comments = null;
              g.isChecked = false;
              g.beginDate = this.myDate();
            }
          });
          console.log(this.whichLearner.LearnerGroupCourse,this.groupCourseInstance);
          this.whichLearner.LearnerGroupCourse.forEach(lg=>{

          })
          //one to one
          this.whichLearner.One2oneCourseInstance.map((o,i)=>{
            console.log(o,pureCourses);
            teacherFilter = allData[i+2].Data;
            this.setUniCatListArray[i]=CatList;
            let courseItemArray1 = pureCourses.filter(e=>
              e.CourseCategory.CourseCategoryId==o.Course.CourseCategoryId
            )
            console.log(courseItemArray1);
            let courseItemArray = courseItemArray1
              .filter(ele =>
                ((o.Course.CourseCategoryId == 1 && ele.Level == this.selectlearnerLevel)
                  || o.Course.CourseCategoryId != 1)
              );
            console.log(courseItemArray);
            console.log(this.courseListArray);
            this.courseListArray[i] = { courseItemArray: courseItemArray };
            console.log(this.courseListArray);
            //let locItemArray = TeacherFilter;
            this.locListArray[i] = { locItemArray: teacherFilter };
            //prepareTeaLevListArray[i].
            console.log(teacherFilter);
            let prepareTeaLevItemArray = teacherFilter.find(e=>e.OrgId==o.OrgId).Level;
            this.prepareTeaLevListArray[i]={prepareTeaLevItemArray:prepareTeaLevItemArray};
            //prepareTeaNameListArray[i].prepareTeaNameItemArray
            let prepareTeaNameItemArray = prepareTeaLevItemArray.find(e => e.levelId == o.Course.TeacherLevel).teacher;
            this.prepareTeaNameListArray[i] = { prepareTeaNameItemArray: prepareTeaNameItemArray };
            //prepareRoomListArray[i].prepareRoomItemArray
            let prepareRoomItemArray = teacherFilter.find(e=>e.OrgId==o.OrgId).Room;
            this.prepareRoomListArray[i]={prepareRoomItemArray:prepareRoomItemArray};
            this.customCourse.push(
              this.fb.group({
                courseCategory: [o.Course.CourseCategoryId],
                course: [o.Course.CourseId],
                teacherLevel: [o.Course.TeacherLevel],
                teacherName: [o.TeacherId],
                location: [o.OrgId],
                room: [o.RoomId],
                beginDate: [o.BeginDate ? o.BeginDate.slice(0, 10) : ''],
                endDate: [o.EndDate ? o.EndDate.slice(0, 10) : ''],
                schedule: this.fb.group({
                  dayOfWeek: [o.CourseSchedule[0]?(o.CourseSchedule[0].DayOfWeek?o.CourseSchedule[0].DayOfWeek:null):null],
                  beginTime: [{
                    hour: o.CourseSchedule[0]?(o.CourseSchedule[0].BeginTime?parseInt(o.CourseSchedule[0].BeginTime.slice(0, 2)):null):null,
                    minute: o.CourseSchedule[0]?(o.CourseSchedule[0].BeginTime?parseInt(o.CourseSchedule[0].BeginTime.slice(3, 5)):null):null,
                    second: o.CourseSchedule[0]?(o.CourseSchedule[0].BeginTime?parseInt(o.CourseSchedule[0].BeginTime.slice(6, 8)):null):null
                  }],//{ hour: 9, minute: 0, second: 0 }
                  //{ hour: 9, minute: 0, second: 0 }  09:03:14
                  durationType: [o.Course.Duration]
                }),
              })
            );
            console.log(o);
            console.log(this.setUniCatListArray, this.courseListArray);
            console.log(this.locListArray, this.prepareTeaLevListArray);
            console.log(this.prepareTeaNameListArray, this.prepareRoomListArray);
          },
            (err) => {
              console.log(err);
              alert('Sorry, something went wrong.'+err)
            }
          );
        })
    }
  }
}
