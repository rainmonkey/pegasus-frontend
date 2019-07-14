/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PageGroupService } from './pageGroup.service';

describe('Service: PageGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageGroupService]
    });
  });

  it('should ...', inject([PageGroupService], (service: PageGroupService) => {
    expect(service).toBeTruthy();
  }));
});
