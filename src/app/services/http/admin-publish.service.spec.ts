import { TestBed } from '@angular/core/testing';

import { AdminPublishService } from './admin-publish.service';

describe('AdminPublishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminPublishService = TestBed.get(AdminPublishService);
    expect(service).toBeTruthy();
  });
});
