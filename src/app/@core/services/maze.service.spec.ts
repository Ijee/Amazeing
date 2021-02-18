import { TestBed } from '@angular/core/testing';

import { MazeService } from './maze.service';

describe('MazeService', () => {
  let service: MazeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MazeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
