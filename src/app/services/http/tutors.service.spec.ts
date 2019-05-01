import { TestBed } from '@angular/core/testing';

import { TutorsService } from './tutors.service';

describe('TutorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TutorsService = TestBed.get(TutorsService);
    expect(service).toBeTruthy();
  });
});
