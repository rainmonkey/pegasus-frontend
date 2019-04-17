import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }
  
  ngOnInit() {
    
    this.registrationForm = this.fb.group({
      // learner form
      learnerForm: this.fb.group({
        firstName: ['stella', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        middleName: [''],
        lastName: ['ru', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        enrollmentDate: [''],
        gender: [''],
        birthday: [''],
        photo: [''],
        contactPhone: [''],
        email: ['stella_ru@outlool.com', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        address: [''],
        grade: ['']
      }),
      // parent form
      parentForm: this.fb.array([
        this.fb.group({
          relationship: ['father', Validators.required],
          firstName: ['stella', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
          lastName: ['ru', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
          contactPhone: ['021080', [Validators.required, Validators.pattern('[0-9]{6}')]],
          email: ['stella_ru@outlook.com', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
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
    console.log(this.registrationForm);
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

  onSubmit() {

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
