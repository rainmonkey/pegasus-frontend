import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialConfirmationComponent } from './trial-confirmation.component';

describe('TrialConfirmationComponent', () => {
  let component: TrialConfirmationComponent;
  let fixture: ComponentFixture<TrialConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
