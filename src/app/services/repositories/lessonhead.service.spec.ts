import { TestBed } from '@angular/core/testing';

import { LessonHeadService } from './lessonhead.service';

describe('LessonheadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LessonHeadService = TestBed.get(LessonHeadService);
    expect(service).toBeTruthy();
  });
});
