import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleRendererComponent } from './article-renderer.component';

describe('LearnPrimsComponent', () => {
    let component: ArticleRendererComponent;
    let fixture: ComponentFixture<ArticleRendererComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArticleRendererComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
