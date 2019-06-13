import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLearnerCourseEditComponent } from './admin-learner-course-edit.component';

describe('AdminLearnerCourseEditComponent', () => {
  let component: AdminLearnerCourseEditComponent;
  let fixture: ComponentFixture<AdminLearnerCourseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerCourseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerCourseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
