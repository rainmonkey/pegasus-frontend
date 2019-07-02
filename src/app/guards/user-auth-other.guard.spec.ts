import { TestBed, async, inject } from '@angular/core/testing';

import { UserAuthOtherGuard } from './user-auth-other.guard';

describe('UserAuthOtherGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAuthOtherGuard]
    });
  });

  it('should ...', inject([UserAuthOtherGuard], (guard: UserAuthOtherGuard) => {
    expect(guard).toBeTruthy();
  }));
});
