import { TestBed, async, inject } from '@angular/core/testing';

import { DashboardRestrictGuard } from './dashboard-restrict.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardRestrictGuard]
    });
  });

  it('should ...', inject([DashboardRestrictGuard], (guard: DashboardRestrictGuard) => {
    expect(guard).toBeTruthy();
  }));
});
