import { TestBed } from '@angular/core/testing';

import { LearnersService } from './learners.service';

describe('LearnersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LearnersService = TestBed.get(LearnersService);
    expect(service).toBeTruthy();
  });
});
