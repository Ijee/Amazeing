import { TestBed } from '@angular/core/testing';

import { UserTourService } from './user-tour.service';

describe('UserTourService', () => {
    let service: UserTourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UserTourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
