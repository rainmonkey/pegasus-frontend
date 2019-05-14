import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDeleteModalComponent } from './course-delete-modal.component';

describe('CourseDeleteModalComponent', () => {
  let component: CourseDeleteModalComponent;
  let fixture: ComponentFixture<CourseDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
