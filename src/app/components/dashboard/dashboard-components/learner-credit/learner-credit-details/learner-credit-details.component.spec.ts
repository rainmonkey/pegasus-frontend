import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCreditDetailsComponent } from './learner-credit-details.component';

describe('LearnerCreditDetailsComponent', () => {
  let component: LearnerCreditDetailsComponent;
  let fixture: ComponentFixture<LearnerCreditDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerCreditDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerCreditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
