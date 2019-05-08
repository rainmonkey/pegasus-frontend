import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsPanelComponent } from './sessions-panel.component';

describe('SessionsPanelComponent', () => {
  let component: SessionsPanelComponent;
  let fixture: ComponentFixture<SessionsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
