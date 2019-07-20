import { TestBed } from '@angular/core/testing';

import { SessionTimePickerService } from './session-time-picker.service';

describe('SessionTimePickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionTimePickerService = TestBed.get(SessionTimePickerService);
    expect(service).toBeTruthy();
  });
});
