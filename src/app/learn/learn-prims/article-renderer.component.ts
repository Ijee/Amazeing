import { Component, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Frontmatter } from '../learn.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-article-renderer',
    templateUrl: './article-renderer.component.html',
    styleUrls: ['./article-renderer.component.scss'],
    imports: [FaIconComponent, CommonModule]
})
export class ArticleRendererComponent {
    @Input() content: Frontmatter = null;
    constructor() {}
}
