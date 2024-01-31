import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnPrimsComponent } from './learn-prims.component';

describe('LearnPrimsComponent', () => {
    let component: LearnPrimsComponent;
    let fixture: ComponentFixture<LearnPrimsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LearnPrimsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LearnPrimsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
