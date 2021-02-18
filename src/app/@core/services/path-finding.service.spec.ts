import { TestBed } from '@angular/core/testing';

import { PathFindingService } from './path-finding.service';

describe('PathFindingService', () => {
  let service: PathFindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathFindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
