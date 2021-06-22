import { TestBed } from '@angular/core/testing';

import { WarningDialogService } from './warning-dialog.service';

describe('WarningDialogService', () => {
    let service: WarningDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WarningDialogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
