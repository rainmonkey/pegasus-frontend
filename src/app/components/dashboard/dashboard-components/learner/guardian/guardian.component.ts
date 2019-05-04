import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-guardian',
  templateUrl: './guardian.component.html',
  styleUrls: ['./guardian.component.css']
})
export class GuardianComponent implements OnInit {
  public guardianForm: FormGroup;
  
  get parentForm() { return this.guardianForm.get('parentForm') as FormArray; }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.guardianForm = this.fb.group({
      parentForm: this.fb.array([
        this.fb.group({
          firstName: ['Ivy', Validators.required],
          lastName: ['Chen', Validators.required],
          relationship: ['1', Validators.required],
          contactPhone: ['6789900', Validators.required],
          email: ['ivychen@gmail.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
        })
      ])
    })
  }

  reset() {
    this.parentForm.reset();
  }
  delete(i: number) {
    this.parentForm.removeAt(i);
  }
  addGuardian() {
    this.parentForm.push(
      this.fb.group({
        firstName: ['Ivy', Validators.required],
        lastName: ['Chen', Validators.required],
        relationship: ['1', Validators.required],
        contactPhone: ['6789900', Validators.required],
        email: ['ivychen@gmail.com', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]]
      })
    );
  }
}
