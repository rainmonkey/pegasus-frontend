import { TestBed } from '@angular/core/testing';

import { GeneralRepoService } from './general-repo.service';

describe('GeneralRepoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralRepoService = TestBed.get(GeneralRepoService);
    expect(service).toBeTruthy();
  });
});
