import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbTimeStruct, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LearnerRegistrationService } from 'src/app/services/http/learner-registration.service';
import { CoursesService } from 'src/app/services/http/courses.service';
import { ngtimepickerValidator } from '../learner-registration-form/validators';
import Swal from 'sweetalert2';
import { LearnerRegistrationModalComponent } from '../learner-registration-modal/learner-registration-modal.component';
import { LearnerRegistrationConfirmModalComponent } from '../learner-registration-confirm-modal/learner-registration-confirm-modal.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bookcourse',
  templateUrl: './bookcourse.component.html',
  styleUrls: ['./bookcourse.component.css']
})
export class BookcourseComponent implements OnInit {
  @ViewChild('agreement')
  agreement: ElementRef;

  @ViewChild('other')
  other: ElementRef;

  // @Input() receivedParentMessage: any;
  // receivedChildMessage: any;
  // courseIntanceGroup: FormGroup;
  @Input() whichLearner;
  @Input() addCourse;
  @Output() toLearnerListEvent: EventEmitter<any> = new EventEmitter;
  public beginTime: any;
  public time: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  public hourStep = 1;
  public minuteStep = 15;
  public registrationForm: FormGroup; // define the type of registrationForm
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
  public selectLearnerLevel: number;
  public pureCourses: any[];
  notPiano = [];
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
  learnerValid = true;
  canAddGroup = true;
  // boolean of font awsome for certificate image
  showFontOfDoc = true;
  // boolean for loading
  isLoading = false;
  // style of image for certificate
  imgTextStyle;
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
  // for edit component;
  assignValue = false;
  // for addcourse modal
  groupCourseForSubmit = [];
  // to date pick
  toDatePickCourseDuration = {};
  teaList;
  teaListOutArray = [];
  teaListToDatePick = [];
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
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
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
      room: [''],
      beginDate: [this.myDate()],
      endDate: [''],
      schedule: this.fb.group({
        dayOfWeek: [''],
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
      }),
      parentForm: this.fb.array([]),
      groupCourse: this.fb.array([]),
      customCourse: this.fb.array([]),
    });


   
    if (this.addCourse == undefined){
    this.setOneToOneForm();}
    else{
      this.customCourse.push(this.courseIntanceGroup);
    }
    //@ts-ignore
    // let abc = this.customCourse.controls[0].controls.roomArray;
    if (!this.whichLearner || this.addCourse) {
      this.getGroupCourseFromServer();
    }

    this.getLookups(1);
    this.toModel(this.time);
    this.getLocationFromServer();
    // init array
    this.initArrays()
    // get data if input
    if (this.addCourse){
    this.selectLearnerLevelFun(this.whichLearner.learnerLevel);
    }
  }

  ngAfterViewInit(){
    console.log('/1@#$%',this.whichLearner)
        // initialize card display
        if(this.addCourse == undefined){
          document.getElementById('learnerForm').style.display = 'block';
          document.getElementById('parentForm').style.display = 'none';
          document.getElementById('courseForm').style.display = 'none';
        }
          else{
            document.getElementById('courseForm').style.display='block'
          }
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


  getCoursesFromServer() {
    this.coursesService.getCourses().subscribe(
      (res) => {
        this.pureCourses = res.Data;
        // get one to one courses
        this.courses121 = res.Data.filter(item => item.CourseType === 1);
        // apply learner level filter
        console.log(this.selectLearnerLevel)
        this.selectLearnerLevel = this.whichLearner?this.whichLearner.LearnerLevel:this.selectLearnerLevel;

        let coursePiano = this.courses121.filter(item => item.CourseCategory.CourseCategoryId === 1)
          .filter((item) => item.Level == this.selectLearnerLevel);
        console.log(this.selectLearnerLevel, coursePiano);
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
        this.catItemArray.forEach(cat => {
          
          catArray.push(JSON.stringify(cat.CourseCategory));
        });
        // use set to find unique values of the stringify array
        let uniCat = arr => Array.from(new Set(arr));
        this.setUniCat = [];
        uniCat(catArray).forEach(ele => {
          // @ts-ignore
          this.setUniCat.push(JSON.parse(ele));
        });
       
        this.setUniCatListArray = [];
        this.setUniCatListArray.push(this.setUniCat);
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
  selectLearnerLevelFun(value) {
    // console.log(value);
    // if (this.whichLearner && this.assignValue && this.addCourse) {
    //   this.assignValue = true;
    // }
    this.customCourse.reset();
    this.customCourse.controls.forEach((item, index) => {
      this.customCourse.removeAt(index);
    });
    this.customCourse.push(this.courseIntanceGroup);
    this.isSelectedLevel = true;
    this.selectLearnerLevel = value;
    this.getCoursesFromServer();
    // let a = this.courses.filter((e) =>  this.selectLearnerLevel == e.Level);

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
        err.error? this.errorMsg == err.error.ErrorMessage : this.errorMsg == `The error code is: ${err}`;
        Swal.fire({
          title: "Do you want to try again?",
          text: 'Can not get the data from server!' + this.errorMsg,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            this.getGroupCourseFromServer()
          }
        })
      }
    )
  }
  
  selectCheckboxes(i, event) {
    this.groupCourseInstance[i].isChecked = event.target.checked;
    console.log(this.groupCourseInstance[i]);
  }
  confirmGroupCourse() {
    let tempGroupModal = {};
    this.groupCourseForSubmit = [];
    this.learnerGroupCourse = []
    for (let groupCourse of this.groupCourseInstance) {
      if (groupCourse.isChecked) {
        this.tempGroupCourseObj = {};
        this.tempGroupCourseObj['GroupCourseInstanceId'] = groupCourse.GroupCourseInstanceId;
        this.tempGroupCourseObj['Comment'] = groupCourse.comments;
        this.tempGroupCourseObj['BeginDate'] = groupCourse.beginDate;
        this.learnerGroupCourse.push(this.tempGroupCourseObj);
        tempGroupModal = {...this.tempGroupCourseObj};
        if (this.whichLearner)
          tempGroupModal['LearnerId'] = this.whichLearner.LearnerId;
        this.groupCourseForSubmit.push(tempGroupModal);
      }
    }
  }

  // 121 course section
  selectLevelType(value) {
    console.log(value)
    this.learnerlevelType = Number(value);
    console.log(value)
    console.log(this.learnerlevelType)
  }
  emptySelectionCat(i) {
    console.log('!@#$%^&*()',this.customCourse.controls[i])
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
    this.teaListOutArray[i].teaListToDatePick = [];
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
    // to date pick
    this.teaListOutArray[i].teaListToDatePick = [];
  }

  // select course category
  selectCategory(id, i) {
    // let courseTemp = [];
    this.emptySelectionCat(i);
    this.notPiano [i] = Number(id);
    this.courseListArray[i].courseItemArray = this.catListArray[i].filter(item => item.CourseCategoryId === Number(id));
    console.log("this.courseListArray", this.courseListArray);
    console.log(this.teaListOutArray[i].teaListToDatePick)
  }

  selectCourse(value, i) {
    this.isLoading = true;
    // to date pick
    this.toDatePickCourseDuration = {}
    this.toDatePickCourseDuration = this.courseListArray[i].courseItemArray.filter(item => item.CourseId === Number(value));
    console.log(this.toDatePickCourseDuration)
    // empty selection
    this.emptySelectionCour(i)
    this.locListArray[i].locItemArray = [];
    return this.registrationService.getTeacherFilter(value).subscribe(
      res => {
        this.isLoading = false;
        this.locListArray[i].locItemArray = res.Data;
        console.log(this.locItemArray);
        // if (this.whichLearner)
        //     this.selectLocation(this.whichLearner.One2oneCourseInstance[i].OrgId, i);

      }, error => {
        this.locListArray[i].locItemArray = [];
        this.errorMsgSub = JSON.parse(error.error);
        console.log("Error!", this.errorMsgSub.ErrorCode);
        this.errorAlert = true;
        error.error? this.errorMsg == error.error.ErrorMessage : this.errorMsg == `The error code is: ${error}`;
        Swal.fire({
          title: "Do you want to try again?",
          text: 'Can not get the data from server!' + this.errorMsg,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Try Again'
        }).then((result) => {
          if (result.value) {
            this.selectCourse(value, i)
          }
        })
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
    if (this.notPiano[i] !== 1) {
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
    this.teaList = this.prepareTeaNameListArray[i].prepareTeaNameItemArray;


    console.log(this.selectedprepareTeaLevInOrgObjListArray[i].selectedprepareTeaLevInOrgObjItemArray)
  }

  //select a particular teacher
  selectTeacher(id, i){
    console.log(i);
    this.teaListOutArray[i].teaListToDatePick = [];
    this.teaList = this.prepareTeaNameListArray[i].prepareTeaNameItemArray;
    this.teaList = this.teaList.filter((item)=> item.TeacherId == Number(id));
    this.teaList = this.teaList.concat(this.toDatePickCourseDuration)
    this.teaList.push(i);
    console.log(this.teaList);
    this.teaListOutArray[i].teaListToDatePick = this.teaList
  }

  // init Array
  initArrays() {
    // empty item
    this.courseItemArray = [];
    this.locItemArray = [];
    this.selectedLocItemArray = [];
    this.prepareRoomItemArray = [];
    this.prepareTeaLevItemArray = [];
    this.selectedprepareTeaLevInOrgObjItemArray = [];
    this.prepareTeaNameInLevObjItemArray = [];
    this.prepareTeaNameItemArray = [];
    this.teaListToDatePick = [];
    // add more list
    this.courseListArray.push(this.courseItemArray)
    this.locListArray.push(this.locItemArray);
    this.selectedLocListArray.push(this.selectedLocItemArray);
    this.prepareRoomListArray.push(this.prepareRoomItemArray);
    this.prepareTeaLevListArray.push(this.prepareTeaLevItemArray);
    this.selectedprepareTeaLevInOrgObjListArray.push(this.selectedprepareTeaLevInOrgObjItemArray);
    this.prepareTeaNameInLevObjListArray.push(this.prepareTeaNameInLevObjItemArray);
    this.prepareTeaNameListArray.push(this.prepareTeaNameItemArray);
    // to date pick
    this.teaListOutArray.push(this.teaListToDatePick);
  }
  // give 0 for time if less than 10
  transformTime(n:number){
    if (n<10)
      return '0'+n;
    else
      return n;
  }
  confirmCustomCourse() {
    let cs = this.customCourse.value;
    console.log('custom Course Form value', cs);
    // let tempObj = {};
    this.oneOnOneCourse = [];
    for (let cc of this.customCourse.value) {
      if (cc.course===''||!cc.course) continue;
      let tempObj = {};
      tempObj['OrgId'] = Number(cc.location);
      this.whichLearner?tempObj['CourseId'] = Number(cc.course):tempObj['CourseId'] = parseInt(cc.course);
      this.whichLearner?tempObj['TeacherId'] = Number(cc.teacherName):tempObj['TeacherId'] = parseInt(cc.teacherName);
      this.whichLearner?tempObj['RoomId'] = Number(cc.room):tempObj['RoomId'] = parseInt(cc.room);
      tempObj['BeginDate'] = cc.beginDate;
      let tempScheduleObj = {};
      tempScheduleObj['DayOfWeek'] = parseInt(cc.schedule.dayOfWeek);
      tempScheduleObj['BeginTime'] = this.transformTime(cc.schedule.beginTime.hour) + ':' + this.transformTime(cc.schedule.beginTime.minute) + ':' + this.transformTime(cc.schedule.beginTime.second);//this.courseTime;
      // tempScheduleObj['DurationType'] = parseInt(cc.course);
      console.log('edwin',cc.schedule.beginTime)
      tempObj['Schedule'] = tempScheduleObj;
      if(this.whichLearner){
        tempObj['LearnerId'] = Number(this.whichLearner.LearnerId)};
      this.oneOnOneCourse.push(tempObj);
    };
  }
  encapsulateLearner(){
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
    this.fdObj['LearnerLevel'] = this.learner.learnerLevel;
    this.fdObj['LevelType'] = this.learnerlevelType;
    this.fdObj['IsUnder18'] = this.learner.isUnder18 ? 1 : 0;
    this.fdObj['PaymentPeriod'] = parseInt(this.learner.paymentPeriod);
    this.fdObj['Referrer'] = this.learner.referrer;
    this.fdObj['Comment'] = this.learner.Comment;
  }

  // submit all
  onSubmit() {
    this.confirmGroupCourse();
    this.confirmCustomCourse();
    this.canAddGroup = true;
    console.log(this.groupCourseInstance, this.oneOnOneCourse);
    let checkGroup = [];
    this.groupCourseInstance.forEach(ele => {
      if (ele.isChecked == true){
        checkGroup.push(1)
      }
    });
    if(checkGroup.length !==0 || this.oneOnOneCourse.length !==0){

    console.log(this.courseGroup);
    this.encapsulateLearner();

    if(this.learnerGroupCourse) {this.fdObj['LearnerGroupCourse'] = this.learnerGroupCourse;}
    if(this.oneOnOneCourse) {this.fdObj['OneToOneCourseInstance'] = this.oneOnOneCourse;}
    if(this.learnerOthers) {this.fdObj['LearnerOthers'] = this.learnerOthers;}
    console.log(this.fdObj);
    this.fd.delete('details');
    this.fd.append('details', JSON.stringify(this.fdObj));
    // console.log('form data', this.fd);
    // active modal waiting for decision
    this.openConfirm();}else{
      this.canAddGroup = false;
    }
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
    this.teaListOutArray[i].teaListToDatePick = [];
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
    this.teaListOutArray.splice(i, 1);
  }
  addCustomCourse(): void {
  
    // add arrays
    this.customCourse.push(this.courseIntanceGroup);
    this.catListArray.push(this.catItemArray);
    this.setUniCatListArray.push(this.setUniCat);
    this.notPiano.push(1);
    // add arrays for select options
    this.initArrays();
    console.log(this.customCourse.value)
  }
  
  //ng-activeModal for time picker
  open(i) {
    this.modalRefTimePicker = this.modalService.open(LearnerRegistrationModalComponent, { windowClass: 'my-class' });
    this.modalRefTimePicker.componentInstance.customCourse = this.customCourse.value[i];
    this.modalRefTimePicker.componentInstance.teaList = this.teaListOutArray[i].teaListToDatePick;
    this.timePickArrayNumber = i;
    this.modalRefTimePicker.componentInstance.beginTimeTo.subscribe(
      (res) =>{
        this.getTimePickerInfo(res,i);
      },
      (err) => {
        console.log(err)
      }
    )

  }
  getTimePickerInfo(time,i){
    console.log(time)
    let timeArray = time.BeginTime.split(':');
    let dayOfWeek = time.DayOfWeek
    let day
    switch (dayOfWeek){
      case 'Monday':
        day = '1';
        break;
      case 'Tuesday':
        day = '2';
        break;
      case 'Wednesday':
        day = '3';
        break;
      case 'Thursday':
        day = '4';
        break;
      case 'Friday':
        day = '5';
        break;
      case 'Saturday':
        day = '6';
        break;
      case 'Sunday':
        day = '7';
        break;
    }
    let timeTrans: NgbTimeStruct = { hour: Number(timeArray[0]), minute: Number(timeArray[1]), second: 0 };
    this.customCourse.controls[i].patchValue({
      schedule: { beginTime: timeTrans, dayOfWeek: day, durationType:''}
    });
    console.log(this.customCourse);
    console.log(this.customCourse.controls[i]);
  }
  // // ng-activeModal for confirm submit
  openConfirm() {
    console.log(this.addCourse)
    this.modalRefConfirm = this.modalService.open(LearnerRegistrationConfirmModalComponent,{backdrop:'static', keyboard:false});
    this.modalRefConfirm.componentInstance.fdObj = this.fd;

  }
  // // check changes
  ngDoCheck() {
   
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
    console.log(this.learnerForm)
    this.learnerValid = true;
    if (value == 'parentForm') {
      this.learnerForm.valid ? this.learnerValid = true : this.learnerValid = false;
    }
   
    if(this.learnerValid){
    this.touchNext = true;
    
    this.showErrorW = false;
      this.showErrorH = false;
      this.touchNext = false;
      document.getElementById('learnerForm').style.display = 'none';
      document.getElementById('parentForm').style.display = 'none';
      document.getElementById('courseForm').style.display = 'none';
      document.getElementById(value).style.display = 'block';}
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
      this.selectLearnerLevel = this.whichLearner.LearnerLevel;

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
                ((o.Course.CourseCategoryId == 1 && ele.Level == this.selectLearnerLevel)
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
