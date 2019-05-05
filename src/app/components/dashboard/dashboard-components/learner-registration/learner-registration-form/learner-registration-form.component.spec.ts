import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerRegistrationFormComponent } from './learner-registration-form.component';

describe('LearnerRegistrationFormComponent', () => {
  let component: LearnerRegistrationFormComponent;
  let fixture: ComponentFixture<LearnerRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
