import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerRegistrationModalComponent } from './learner-registration-modal.component';

describe('LearnerRegistrationModalComponent', () => {
  let component: LearnerRegistrationModalComponent;
  let fixture: ComponentFixture<LearnerRegistrationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerRegistrationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
