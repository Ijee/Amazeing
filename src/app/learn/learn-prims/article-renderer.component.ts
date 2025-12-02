import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Frontmatter } from '../learn.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-article-renderer',
    templateUrl: './article-renderer.component.html',
    styleUrls: ['./article-renderer.component.scss'],
    imports: [FaIconComponent, DatePipe]
})
export class ArticleRendererComponent {
    readonly content = input<Frontmatter>(null);
    constructor() {}
}
