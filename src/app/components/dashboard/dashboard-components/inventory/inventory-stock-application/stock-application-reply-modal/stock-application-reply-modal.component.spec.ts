import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApplicationReplyModalComponent } from './stock-application-reply-modal.component';

describe('StockApplicationReplyModalComponent', () => {
  let component: StockApplicationReplyModalComponent;
  let fixture: ComponentFixture<StockApplicationReplyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockApplicationReplyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockApplicationReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
