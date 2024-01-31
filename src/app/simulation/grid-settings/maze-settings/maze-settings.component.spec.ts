import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeSettingsComponent } from './maze-settings.component';

describe('MazeSettingsComponent', () => {
    let component: MazeSettingsComponent;
    let fixture: ComponentFixture<MazeSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MazeSettingsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MazeSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
