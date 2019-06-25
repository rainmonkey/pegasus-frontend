import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindModalComponent } from './remind-modal.component';

describe('RemindModalComponent', () => {
  let component: RemindModalComponent;
  let fixture: ComponentFixture<RemindModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
