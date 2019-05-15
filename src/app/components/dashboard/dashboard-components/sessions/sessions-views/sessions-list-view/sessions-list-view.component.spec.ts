import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsListViewComponent } from './sessions-list-view.component';

describe('SessionsListViewComponent', () => {
  let component: SessionsListViewComponent;
  let fixture: ComponentFixture<SessionsListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
