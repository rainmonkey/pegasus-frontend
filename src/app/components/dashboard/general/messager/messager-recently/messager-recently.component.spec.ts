import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerRecentlyComponent } from './messager-recently.component';

describe('MessagerRecentlyComponent', () => {
  let component: MessagerRecentlyComponent;
  let fixture: ComponentFixture<MessagerRecentlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagerRecentlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerRecentlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
