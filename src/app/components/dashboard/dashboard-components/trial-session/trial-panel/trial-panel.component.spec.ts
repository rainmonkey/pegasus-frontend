import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialPanelComponent } from './trial-panel.component';

describe('TrialPanelComponent', () => {
  let component: TrialPanelComponent;
  let fixture: ComponentFixture<TrialPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
