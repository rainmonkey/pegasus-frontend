import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseClassDetailModalComponent } from './course-class-detail-modal.component';

describe('CourseClassDetailModalComponent', () => {
  let component: CourseClassDetailModalComponent;
  let fixture: ComponentFixture<CourseClassDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseClassDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseClassDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
