import { TestBed, async, inject } from '@angular/core/testing';

import { AdvancedRestrictGuard } from './advanced-restrict.guard';

describe('AdvancedRestrictGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdvancedRestrictGuard]
    });
  });

  it('should ...', inject([AdvancedRestrictGuard], (guard: AdvancedRestrictGuard) => {
    expect(guard).toBeTruthy();
  }));
});
