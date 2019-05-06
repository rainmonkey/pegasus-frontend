import { TestBed } from '@angular/core/testing';

import { NgbootstraptableService } from './ngbootstraptable.service';

describe('NgbootstraptableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgbootstraptableService = TestBed.get(NgbootstraptableService);
    expect(service).toBeTruthy();
  });
});
