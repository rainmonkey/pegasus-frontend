import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from '../../../../services/registration.service';
import { StudentDetail } from '../../../../models/StudentDetail';
import { Parent } from 'src/app/models/Parent';

@Component({
  selector: 'app-registration',
  // templateUrl: './registration.component.html',
  // styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public todays = new Date();
  public registrationForm: FormGroup;  // define the type of registrationForm
  public students = new StudentDetail();  // create an instance of class StudentDetail 
  public selectedPhoto: File = null;
  public selectedGrade: File = null;
  public today = new Date();
  public errorMsg: string;  // help us display error message from server in template
  public successMsg: string; // display message to user when they posted data to server successfully
  public guitars: Array<any>;
  public pianos: Array<any>;
  public drums: Array<any>;
  public selectedCourse: string;
  public isSelectedLevel: boolean = false;
  public courses = ['guitar', 'piano', 'drum'];
  public learnerLevel = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];
  public teachers = {
    "junior": ['Michael', 'Ivy', 'Tom'],
    'intermediate': ['Andrew', 'Candy', 'Daniel'],
    'senior': ['Ella', 'Flank', 'Hellen']
  };
  public parents = new Parent();
  


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
    private registrationService: RegistrationService
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
        grade: ['']
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
      groupCourse: this.fb.array([
        this.fb.group({
          course: [''],
          groupCourseTime: [''],
          location: ['']
        })
      ]),
      customCourse: this.fb.array([
        this.fb.group({
          course: [''],
          learnerLevel: [''],
          hasExamed: [''],
          teacherLevel: [''],
          teacherName: [''],
          customTime: [''],
          location: ['']
        })
      ]),
    });
    console.log('parent', this.registrationForm);

    // initialize card display
    document.getElementById('learnerForm').style.display = 'none';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'block';
  }



  uploadPhoto(event: any) {
    this.selectedPhoto = <File>event.target.files[0];
  }
  uploadGrade(event: any) {
    this.selectedGrade = <File>event.target.files[0];
  }
  selectCourse(name: string) {
    this.selectedCourse = name;
    this.registrationService.getGroupCourse()
        .subscribe(
          data => {
            this.guitars = data.guitar;
            this.pianos = data.piano;
            this.drums = data.drum;
          }
        );
  }
  selectLlevel() {
    this.isSelectedLevel = true;
  }
  onSubmit() {
    console.log('Test submit');
    let fd = new FormData();
    let learner = this.learnerForm.value;
    fd.append('FirstName', learner.firstName);
    fd.append('MiddleName', learner.middleName);
    fd.append('LastName', learner.firstName);
    fd.append('Gender', learner.gender);
    fd.append('dob', learner.birthday);
    fd.append('DateOfEnrollment', learner.enrollmentDate);
    fd.append('ContactPhone', learner.contactPhone);
    fd.append('Email', learner.email);
    fd.append('Address', learner.address);
    fd.append('image', this.selectedPhoto);
    fd.append('ABRSM', this.selectedGrade);
    fd.append('FirstName', learner.firstName);
    // for (let parent of this.parentForm.value) {
    //   fd.append('ParentFirstName', parent.firstName);
    //   fd.append('ParentLastName', parent.lastName);
    //   fd.append('ParentRelationship', parent.relationship);
    //   fd.append('ParentContactNum', parent.contactPhone);
    //   fd.append('ParentEmail', parent.email)
    // }
    // fd.append('FirstName', learner.firstName);
    for(let parent of this.parentForm.value) {
       this.parents['FirstName']=parent.firstName;
       this.parents['LastName']=parent.lastName;
       this.parents['Relationship']=parseInt(parent.relationship);
       this.parents['ContactNum']=parent.contactPhone;
       this.parents['Email']=parent.email;
       fd.append('Parent', JSON.stringify(this.parents));
    for (let parent of this.parentForm.value) {
      fd.append('GuardianFirstName', parent.firstName);
      fd.append('GuardianLastName', parent.lastName);
      fd.append('GuardianRelationship', parent.relationship);
      fd.append('GuardianPhone', parent.contactPhone);
      fd.append('GuardianEmail', parent.email);
    }
    this.registrationService.postStudent(fd)
        .subscribe(
          data => {
            this.successMsg = data;
            console.log('Success!', data);
          },
          error => {
            this.errorMsg = error;
            console.log('Error!', error);
          }
        )
  }
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
  }
  // resetGroupCourse() {
  //   this.groupCourse.reset();
  // }
  // deleteGroupCourse(i: number) {
  //   this.groupCourse.removeAt(i);
  // }
  // addGroupCourse() {
  //   this.groupCourse.push(
  //     this.fb.group({
  //       course: ['', Validators.required],
  //       teacherName: [''],
  //       groupTime: [''],
  //       branch: ['']
  //     })
  //   );
  // }
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

// go and next function
  next(value: any) {
    value.event.preventDefault();
    document.getElementById('learnerForm').style.display = 'none';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById(value.id).style.display = 'block';
    
  }
  chooseCourse(id: any) {
    document.getElementById('groupCourse').style.display = 'none';
    document.getElementById('customCourse').style.display = 'none';
    document.getElementById(id).style.display = 'block';
  }
}
