import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialTesterComponent } from './trial-tester.component';

describe('TrialTesterComponent', () => {
  let component: TrialTesterComponent;
  let fixture: ComponentFixture<TrialTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
