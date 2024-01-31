import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSettingsComponent } from './grid-settings.component';

describe('Placeholder1Component', () => {
    let component: GridSettingsComponent;
    let fixture: ComponentFixture<GridSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GridSettingsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GridSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
