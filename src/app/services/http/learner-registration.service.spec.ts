import { TestBed } from '@angular/core/testing';

import { LearnerRegistrationService } from './learner-registration.service';

describe('LearnerRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LearnerRegistrationService = TestBed.get(LearnerRegistrationService);
    expect(service).toBeTruthy();
  });
});
