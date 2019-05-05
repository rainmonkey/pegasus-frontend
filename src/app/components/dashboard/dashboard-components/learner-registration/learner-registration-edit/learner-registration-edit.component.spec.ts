import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerRegistrationEditComponent } from './learner-registration-edit.component';

describe('LearnerRegistrationEditComponent', () => {
  let component: LearnerRegistrationEditComponent;
  let fixture: ComponentFixture<LearnerRegistrationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerRegistrationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerRegistrationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
