import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialInfoComponent } from './trial-info.component';

describe('TrialInfoComponent', () => {
  let component: TrialInfoComponent;
  let fixture: ComponentFixture<TrialInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
