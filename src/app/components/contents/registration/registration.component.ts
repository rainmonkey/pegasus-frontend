import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from '../../../services/registration.service';
import { StudentDetail } from '../../../models/StudentDetail';
import { TestBed } from '@angular/core/testing';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {


  public registrationForm: FormGroup;
  public students = new StudentDetail; 
  public selectedImg: File = null;
  public selectedPhoto: File = null;
  public errorMsg: string;

  constructor(
    private fb: FormBuilder,
    private _registrationService: RegistrationService) 
    { }

   
  ngOnInit() {
    this.students.Email= "sfdsfa";
    console.log('pppp', this.students)
    this.registrationForm = this.fb.group({
      // learner form
      learnerForm: this.fb.group({
        firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        middleName: ['x'],
        lastName: ['ru', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        enrollmentDate: ['2018-11-09'],
        gender: ['1'],
        birthday: ['1998-03-03'],
        photo: [''],
        contactPhone: ['3132323'],
        email: ['stella_ru@jija.com', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        address: ['fadsfaefas'],
        grade: ['']
      }),
      // parent form
      parentForm: this.fb.array([
        this.fb.group({
          relationship: ['1', Validators.required],
          firstName: ['sfs', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
          lastName: ['fesfs', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
          contactPhone: ['23313', [Validators.required, Validators.pattern('[0-9]{6}')]],
          email: ['fafaf@fas.com', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
        })
      ]),
      // group class form
      groupCourse: this.fb.array([
        this.fb.group({ 
          course: ['', Validators.required],
          teacherName: [''],
          groupTime: [''],
          branch: ['']
        })
      ]),
      // custom class form
      customCourse: this.fb.array([
        this.fb.group({
          course: [''],
          learnerLevel: [''],
          teacherLevel: [''],
          teacherName: [''],
          customTime: [''],
          branch: [''],
        })
      ]),
    });

    // initialize card display
    document.getElementById('learnerForm').style.display = 'block';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById('groupCourse').style.display = 'block';
    document.getElementById('customCourse').style.display = 'none';

  }

  
  // get controls for validation
  get firstName() { return this.registrationForm.get('learnerForm').get('firstName'); }
  get lastName() { return this.registrationForm.get('learnerForm').get('lastName'); }
  get email() { return this.registrationForm.get('learnerForm').get('email'); }
  get learnerForm() { return this.registrationForm.get('learnerForm'); }
  get parentForm() { return this.registrationForm.get('parentForm') as FormArray; }
  get groupCourse() { return this.registrationForm.get('groupCourse') as FormArray; }
  get customCourse() { return this.registrationForm.get('customCourse') as FormArray; }


  test(e) {
      console.log(e)
  }

  // encapsulate student's detail
  uploadImage(e) {
    console.log('grade',e);
    this.selectedImg = <File>e.target.files[0];
  }
 
  uploadPhoto(e) {
    console.log('photo', e)
    this.selectedPhoto = <File>e.target.files[0];
  }

  onSubmit() {
    let fd = new FormData();
    let learner = this.learnerForm.value;
    fd.append('FirstName', learner.firstName);
    fd.append('LastName', learner.firstName);
    fd.append('MiddleName', learner.middleName);
    fd.append('Gender', learner.gender);
    fd.append('dob', learner.birthday);
    fd.append('DateOfEnrollment', learner.enrollmentDate);
    fd.append('ContactPhone', learner.contactPhone);
    fd.append('Email', learner.email);
    fd.append('image', this.selectedPhoto);
    fd.append('Address', learner.address);
    fd.append('ABRSM', this.selectedImg);
    for (let parent of this.parentForm.value) {
      fd.append('GuardianFirstName', parent.firstName);
      fd.append('GuardianLastName', parent.lastName);
      fd.append('GuardianRelationship', parent.relationship);
      fd.append('GuardianPhone', parent.contactPhone);
      fd.append('GuardianEmail', parent.email)
    }
 
    console.log('array',)
    this._registrationService.postLearner(fd)
        .subscribe(
          data => console.log('Success!', data),
          error => {
            this.errorMsg = error;
            console.log('error', this.errorMsg);
          }
        )
        
  }

// operate learner form
  editLearner() {
  }
  resetLearner() {
    this.learnerForm.reset();
  }
// operate parent form
  addParent(): any {
    this.parentForm.push(
      this.fb.group({
        relationship: ['', Validators.required],
        firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        contactPhone: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
      })
    );
  }
  editParent() {

  }
  resetParent() {
    this.parentForm.reset();
  }
  deleteParent(i: any) {
    this.parentForm.removeAt(i);
  }


// operate course form
  addGroupCourse() {
    this.groupCourse.push(
      this.fb.group({
        course: ['', Validators.required],
        teacherName: [''],
        groupTime: [''],
        branch: ['']
      })
    );
  }
  deleteGroupCourse(i: any) {
    this.groupCourse.removeAt(i);
  }
  resetGroupCourse() {
    this.groupCourse.reset();
  }
  editGroupCourse() {

  }
  
  addCustomCourse(): void {
    this.customCourse.push(
      this.fb.group({
        course: [''],
        learnerLevel: [''],
        teacherLevel: [''],
        teacherName: [''],
        customTime: [''],
        branch: [''],
      })
    );
  }
  deleteCustomCourse(i: any): void {
    this.customCourse.removeAt(i);
  }
  resetCustomCourse() {
    this.customCourse.reset();
  }
  editCustomCourse() {

  }
  
  

// go and next function
  next(id: string) {
    document.getElementById('learnerForm').style.display = 'none';
    document.getElementById('parentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById(id).style.display = 'block';
  }
  chooseCourse(id: any) {
    document.getElementById('groupCourse').style.display = 'none';
    document.getElementById('customCourse').style.display = 'none';
    document.getElementById(id).style.display = 'block';
  }

  
}
