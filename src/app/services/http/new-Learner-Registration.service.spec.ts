/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewLearnerRegistrationService } from './new-Learner-Registration.service';

describe('Service: NewLearnerRegistration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewLearnerRegistrationService]
    });
  });

  it('should ...', inject([NewLearnerRegistrationService], (service: NewLearnerRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
