import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourseModalComponent } from './teacher-course-modal.component';

describe('TeacherCourseModalComponent', () => {
  let component: TeacherCourseModalComponent;
  let fixture: ComponentFixture<TeacherCourseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherCourseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
