import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialConfirmComponent } from './trial-confirm.component';

describe('TrialConfirmComponent', () => {
  let component: TrialConfirmComponent;
  let fixture: ComponentFixture<TrialConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
