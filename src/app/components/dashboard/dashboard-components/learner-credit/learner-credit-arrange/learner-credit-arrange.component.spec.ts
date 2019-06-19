import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCreditArrangeComponent } from './learner-credit-arrange.component';

describe('LearnerCreditArrangeComponent', () => {
  let component: LearnerCreditArrangeComponent;
  let fixture: ComponentFixture<LearnerCreditArrangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerCreditArrangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerCreditArrangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
