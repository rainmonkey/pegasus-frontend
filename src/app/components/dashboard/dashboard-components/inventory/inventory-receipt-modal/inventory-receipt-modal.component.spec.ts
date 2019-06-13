import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReceiptModalComponent } from './inventory-Receipt-modal.component';

describe('InventoryReceiptModalComponent', () => {
  let component: InventoryReceiptModalComponent;
  let fixture: ComponentFixture<InventoryReceiptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReceiptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReceiptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
