import { TestBed } from '@angular/core/testing';

import { InvoiceValidatorsService } from './invoice-validators.service';

describe('InvoiceValidatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoiceValidatorsService = TestBed.get(InvoiceValidatorsService);
    expect(service).toBeTruthy();
  });
});
