/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaffListService } from './staff-list.service';

describe('Service: StaffList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaffListService]
    });
  });

  it('should ...', inject([StaffListService], (service: StaffListService) => {
    expect(service).toBeTruthy();
  }));
});
