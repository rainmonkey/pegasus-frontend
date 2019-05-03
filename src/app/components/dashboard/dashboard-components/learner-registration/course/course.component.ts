import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { RegistrationService } from '../../../../../services/registration.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  public courseForm: FormGroup;
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

  get groupCourse() { return this.courseForm.get('groupCourse') as FormArray; }
  get customCourse() { return this.courseForm.get('customCourse') as FormArray; }

  constructor(private fb: FormBuilder, private registrationService: RegistrationService) { }

  ngOnInit() {
    this.courseForm = this.fb.group({
      groupCourse: this.fb.array([
        this.fb.group({
          course: [''],
          groupTime: [''],
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
      ])
    });
    document.getElementById('groupCourse').style.display = 'block';
    document.getElementById('customCourse').style.display = 'none';
  }

  resetCustomCourse() {
    this.customCourse.reset();
  }
  deleteCustomCourse(i: number): void {
    this.customCourse.removeAt(i);
  }
  addCustomCourse() {
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
  select(id: string) {
    document.getElementById('groupCourse').style.display = 'none';
    document.getElementById('customCourse').style.display = 'none';
    document.getElementById(id).style.display = 'block';
  }
}
