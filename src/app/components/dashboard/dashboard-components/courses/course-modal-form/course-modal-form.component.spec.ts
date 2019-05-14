import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseModalFormComponent } from './course-modal-form.component';

describe('CourseModalFormComponent', () => {
  let component: CourseModalFormComponent;
  let fixture: ComponentFixture<CourseModalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseModalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
