import { TestBed } from '@angular/core/testing';

import { LookUpsService } from './look-ups.service';

describe('LookUpsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LookUpsService = TestBed.get(LookUpsService);
    expect(service).toBeTruthy();
  });
});
