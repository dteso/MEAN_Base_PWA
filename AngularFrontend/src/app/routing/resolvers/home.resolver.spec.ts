import { TestBed } from '@angular/core/testing';

import { HomeResolver } from './home.resolver';

describe('HomeResolver', () => {
  let resolver: HomeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(HomeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
