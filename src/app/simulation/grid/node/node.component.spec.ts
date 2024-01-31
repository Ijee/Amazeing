import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeComponent } from './node.component';

describe('CellComponent', () => {
    let component: NodeComponent;
    let fixture: ComponentFixture<NodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NodeComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
