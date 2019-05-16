import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-registration-form',
  templateUrl: './learner-registration-form.component.html',
  styleUrls: ['./learner-registration-form.component.css']
})
export class LearnerRegistrationFormComponent implements OnInit {
  time: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;
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
  public teacherInfo: Array<any>;
  //public selectedCourse: string;
  public isSelectedLevel: boolean = false;
  public courses = ['guitar', 'piano', 'drum'];
  public learnerLevel: Array<any>;
  public teachers = {
    "junior": ['Michael', 'Ivy', 'Tom'],
    'intermediate': ['Andrew', 'Candy', 'Daniel'],
    'senior': ['Ella', 'Flank', 'Hellen']
  };
  public fd = new FormData;
  public learner: any;
  public parent = [];
  public fdObj = {};
  public isGroupCourse: boolean = true;
  public isCustomCourse: boolean = false;

  // getter method: simplify the way to capture form controls
  get firstName() { return this.registrationForm.get('learnerForm').get('firstName'); }
  get lastName() { return this.registrationForm.get('learnerForm').get('lastName'); }
  get gender() { return this.registrationForm.get('learnerForm').get('gender'); }
  get email() { return this.registrationForm.get('learnerForm').get('email'); }
  get learnerForm() { return this.registrationForm.get('learnerForm'); }
  get parentForm() { return this.registrationForm.get('parentForm') as FormArray; }
  get groupCourse() { return this.registrationForm.get('groupCourse'); }
  get customCourse() { return this.registrationForm.get('customCourse') as FormArray; }

  constructor(
    private fb: FormBuilder,
    private registrationService: LearnerRegistrationService
  ) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      learnerForm: this.fb.group({
        firstName: ['Tom', Validators.required],
        middleName: ['x'],
        lastName: ['Li', Validators.required],
        gender: ['1', Validators.required],
        birthday: ['2018-01-01'],
        enrollmentDate: ['2018-12-21'],
        contactPhone: ['012345678'],
        email: ['rrrrrr@gamil.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        address: ['110 Station'],
        photo: [''],
        grade: [''],
        learnPurpose: [''],
        infoFrom: [''],
        learnerLevel: [''],
        location: [''],
        hasExamed: [''],
      }),
      parentForm: this.fb.array([
        this.fb.group({
          firstName: ['Ivy', Validators.required],
          lastName: ['Chen', Validators.required],
          relationship: ['1', Validators.required],
          contactPhone: ['6789900', Validators.required],
          email: ['ivychen@gmail.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
        })
      ]),
      groupCourse: this.fb.group({
          course: [''],
          groupCourseTime: [''],
          location: [''],
          comment: ['', Validators.required]
      }),
      customCourse: this.fb.array([
        this.fb.group({
          course: [''],
          teacherLevel: [''],
          teacherName: [''],
          customday: [''],
          customTime: [''],
          customHour: [''],      
          customMinute: [''],                           
          location: ['']
        })
      ]),
    });

    // // initialize card display
    document.getElementById('learnerForm').style.display = 'none';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'block';
  
    this.getGroupCourse();
    this.getTeacherInfo();
    this.getLookups(1);
    this.getOrgs();
  }

  // encapsulate files form data
  uploadPhoto(event: any) {
    this.selectedPhoto = <File>event.target.files[0];
    // console.log('photo', this.selectedPhoto);
    this.fd.append('photo', this.selectedPhoto);
  }
  uploadGrade(event: any) {
    this.selectedGrade = <File>event.target.files[0];
    // console.log('ABRSM', this.selectedGrade);
    this.fd.append('ABRSM', this.selectedGrade);
  }
 
  selectLlevel() {
    this.isSelectedLevel = true;
  }
  getLookups(id: number) {
    this.registrationService.getLookups(1)
      .subscribe(
        data => {
          console.log('teacher info', data);
          this.learnerPurpose = data.Data;
        },
        err => {
          console.log('teacher info err', err);
        }
      );
    this.registrationService.getLookups(2)
      .subscribe(
        data => {
          console.log('learner purpose', data);
          this.learnerPurpose = data.Data;
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
      )
  }
  getGroupCourse() {
   // this.selectedCourse = name;
    this.registrationService.getGroupCourse()
      .subscribe(
        data => {
          console.log('group course data', data);
          this.groupCourseInstance = data.Data;
        },
        err => {
          console.log('group course err', err);          
        }
      )       
  }
  getTeacherInfo() {
    this.registrationService.getTeacherFilter()
      .subscribe(
        data => {
          console.log('teacher filter', data);
          this.customCourseInstance = data.Data;
          data.Data.map(element => {
            this.teacherLevel = element.Level;
          });
          console.log('teacher level', this.teacherLevel);
          data.Data.map(element => {
            this.customCourseRoom = element.Room;
          });
          console.log('room', this.customCourseRoom);
          this.teacherLevel.map(element => {
            this.teacherInfo = element.teacher;
          });
          console.log('teacher info', this.teacherInfo);
        },
        err => {
          console.log('teacher filter err', err);
        }
      )
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
    this.fdObj['MiddleName']=this.learner.middleName;
    this.fdObj['LastName']= this.learner.firstName;
    this.fdObj['Gender']= this.learner.gender;
    this.fdObj['dob']= this.learner.birthday;
    this.fdObj['DateOfEnrollment']= this.learner.enrollmentDate;
    this.fdObj['ContactPhone']= this.learner.contactPhone;
    this.fdObj['Email']=this.learner.email;
    this.fdObj['Address']= this.learner.address;
    this.fdObj['Comment']=this.groupCourse.value.comment;
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
    this.fdObj['Parent']= this.parent;
    this.fd.append('details', JSON.stringify(this.fdObj)); 

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
        course: [''],
        learnerLevel: [''],
        hasExamed: [''],
        teacherLevel: [''],
        teacherName: [''],
        customTime: [''],
        location: ['']
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
    document.getElementById('learnerForm').style.display = 'none';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById(value).style.display = 'block';
  }
}

