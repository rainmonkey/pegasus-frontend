import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCreditPanelComponent } from './learner-credit-panel.component';

describe('LearnerCreditPanelComponent', () => {
  let component: LearnerCreditPanelComponent;
  let fixture: ComponentFixture<LearnerCreditPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerCreditPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerCreditPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
