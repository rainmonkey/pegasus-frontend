/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HolidaysService } from './holidays.service';

describe('Service: Holidays', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HolidaysService]
    });
  });

  it('should ...', inject([HolidaysService], (service: HolidaysService) => {
    expect(service).toBeTruthy();
  }));
});
