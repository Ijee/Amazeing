import { TestBed } from '@angular/core/testing';

import { ViewTransitionService } from './view-transition.service';

describe('ViewTransitionService', () => {
    let service: ViewTransitionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ViewTransitionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
