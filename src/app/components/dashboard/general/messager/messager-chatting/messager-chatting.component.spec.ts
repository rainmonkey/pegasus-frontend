import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerChattingComponent } from './messager-chatting.component';

describe('MessagerChattingComponent', () => {
  let component: MessagerChattingComponent;
  let fixture: ComponentFixture<MessagerChattingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagerChattingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerChattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
