import { TestBed } from '@angular/core/testing';

import { LearnerListService } from './learner-list.service';

describe('LearnerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LearnerListService = TestBed.get(LearnerListService);
    expect(service).toBeTruthy();
  });
});
