import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.css']
})
export class LearnerComponent implements OnInit {
  public learnerForm: FormGroup;
  public selectedPhoto: File = null;
  public selectedGrade: File = null;


  get firstName() { return this.learnerForm.get('firstName'); }
  get lastName() { return this.learnerForm.get('lastName'); }
  get gender() { return this.learnerForm.get('gender'); }
  get email() { return this.learnerForm.get('email'); }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.learnerForm = this.fb.group({
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
    })
  }

  uploadPhoto(event: any) {
    this.selectedPhoto = <File>event.target.files[0];
  }
  uploadGrade(event: any) {
    this.selectedGrade = <File>event.target.files[0];
  }
  reset() {
    this.learnerForm.reset();
  }
  next() {
    
  }
}

