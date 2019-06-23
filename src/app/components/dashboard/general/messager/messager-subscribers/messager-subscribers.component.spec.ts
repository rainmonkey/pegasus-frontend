import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerSubscribersComponent } from './messager-subscribers.component';

describe('MessagerSubscribersComponent', () => {
  let component: MessagerSubscribersComponent;
  let fixture: ComponentFixture<MessagerSubscribersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagerSubscribersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerSubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
