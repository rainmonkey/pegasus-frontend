import { TestBed } from '@angular/core/testing';

import { AdminpaymentlistService } from './adminpaymentlist.service';

describe('AdminpaymentlistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminpaymentlistService = TestBed.get(AdminpaymentlistService);
    expect(service).toBeTruthy();
  });
});
