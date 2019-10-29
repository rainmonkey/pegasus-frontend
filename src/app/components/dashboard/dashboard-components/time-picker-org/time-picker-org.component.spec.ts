import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerOrgComponent } from './time-picker-org.component';

describe('TimePickerOrgComponent', () => {
  let component: TimePickerOrgComponent;
  let fixture: ComponentFixture<TimePickerOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePickerOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
