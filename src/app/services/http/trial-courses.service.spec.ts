import { TestBed } from '@angular/core/testing';

import { TrialCoursesService } from './trial-courses.service';

describe('TrialCoursesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrialCoursesService = TestBed.get(TrialCoursesService);
    expect(service).toBeTruthy();
  });
});
