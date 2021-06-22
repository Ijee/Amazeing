import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfindingSettingsComponent } from './pathfinding-settings.component';

describe('PathfindingSettingsComponent', () => {
    let component: PathfindingSettingsComponent;
    let fixture: ComponentFixture<PathfindingSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PathfindingSettingsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PathfindingSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
