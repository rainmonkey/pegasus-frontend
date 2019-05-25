import { TestBed } from '@angular/core/testing';

import { MessagesLibrary } from './messages-library';

describe('MessagesLibrary', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessagesLibrary = TestBed.get(MessagesLibrary);
    expect(service).toBeTruthy();
  });
});
