import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorInfoPanelComponent } from './tutor-info-panel.component';

describe('TutorInfoPanelComponent', () => {
  let component: TutorInfoPanelComponent;
  let fixture: ComponentFixture<TutorInfoPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorInfoPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
