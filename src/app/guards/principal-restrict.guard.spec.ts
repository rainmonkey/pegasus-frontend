import { TestBed, async, inject } from '@angular/core/testing';

import { PrincipalRestrictGuard } from './principal-restrict.guard';

describe('PrincipalRestrictGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrincipalRestrictGuard]
    });
  });

  it('should ...', inject([PrincipalRestrictGuard], (guard: PrincipalRestrictGuard) => {
    expect(guard).toBeTruthy();
  }));
});
