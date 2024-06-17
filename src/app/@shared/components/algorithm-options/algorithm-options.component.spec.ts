import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmOptionsComponent } from './algorithm-options.component';

describe('AlgorithmOptionsComponent', () => {
    let component: AlgorithmOptionsComponent;
    let fixture: ComponentFixture<AlgorithmOptionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlgorithmOptionsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AlgorithmOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
