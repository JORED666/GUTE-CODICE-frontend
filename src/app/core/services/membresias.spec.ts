import { TestBed } from '@angular/core/testing';

import { Membresias } from './membresias';

describe('Membresias', () => {
  let service: Membresias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Membresias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
