import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLearnerPeriodCourseChangeModalComponent } from './admin-learner-period-course-change-modal.component';

describe('AdminLearnerPeriodCourseChangeModalComponent', () => {
  let component: AdminLearnerPeriodCourseChangeModalComponent;
  let fixture: ComponentFixture<AdminLearnerPeriodCourseChangeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLearnerPeriodCourseChangeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLearnerPeriodCourseChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
