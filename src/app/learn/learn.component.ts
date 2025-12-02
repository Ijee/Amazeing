import { SettingsService } from './../@core/services/settings.service';
import { AlgorithmService } from 'src/app/@core/services/algorithm.service';
import {
    Component,
    effect,
    ElementRef,
    OnInit,
    Renderer2,
    signal,
    ViewChild,
    ViewEncapsulation,
    DOCUMENT
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HrComponent } from '../@shared/components/hr/hr.component';
import { ArticleRendererComponent } from './learn-prims/article-renderer.component';
import { MazeAlgorithm, PathFindingAlgorithm } from '../@core/types/algorithm.types';
import { NgClass } from '@angular/common';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
export interface Link {
    title: string;
    url: string;
}

export interface ArticleData {
    title: string;
    links: Link[];
    'last-change': string; // Datum im Format "DD.MM.YYYY"
}

export interface Frontmatter {
    content: string;
    data: ArticleData;
    isEmpty: boolean;
    excerpt: string;
    path: string;
}
@Component({
    selector: 'app-learn',
    templateUrl: './learn.component.html',
    styleUrls: ['./learn.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [FaIconComponent, HrComponent, ArticleRendererComponent, NgClass]
})
export class LearnComponent implements OnInit {
    @ViewChild('test') input: ElementRef<HTMLInputElement>;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly http = inject(HttpClient);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly renderer = inject(Renderer2);
    private readonly document = inject(DOCUMENT);
    private readonly settingsService = inject(SettingsService);
    private algorithm: string;
    public content: Frontmatter;
    public algorithmSelection = signal<MazeAlgorithm | PathFindingAlgorithm>(null);

    constructor() {
        this.algorithm = this.activatedRoute.snapshot.params['algorithm'];

        effect(() => {
            if (this.algorithmSelection() !== null) {
                const rootElement = this.document.documentElement; // Target the root element

                if (!this.settingsService.getAnimationsSetting()) {
                    this.renderer.addClass(rootElement, 'no-root-view-transition');
                }
                this.router
                    .navigate([], {
                        relativeTo: this.activatedRoute,
                        queryParams: { algorithm: this.algorithmSelection() },
                        queryParamsHandling: 'merge'
                    })
                    .finally(() => {
                        // remove class after it is done
                        setTimeout(() => {
                            this.renderer.removeClass(rootElement, 'no-root-view-transition');
                        }, 1000); // Ensure the class is removed after the navigation has completed
                    });

                this.http
                    .get('assets/articles/' + this.algorithmSelection().toLowerCase() + '.json', {
                        responseType: 'json'
                    })
                    .subscribe((res: Frontmatter) => {
                        this.content = res;
                    });
            }
        });
    }
    ngOnInit(): void {
        this.route.queryParams.pipe(first()).subscribe((params) => {
            const pathFindingAlgorithms = new Set<MazeAlgorithm | PathFindingAlgorithm>([
                'Prims',
                'Kruskals',
                'Aldous-Broder',
                'Wilsons',
                'Ellers',
                'Sidewinder',
                'Hunt-and-Kill',
                'Growing-Tree',
                'Binary-Tree',
                'Recursive-Backtracking',
                'Recursive-Division',
                'Cellular-Automaton',
                'A-Star',
                'IDA-Star',
                'Dijkstra',
                'Breadth-FS',
                'Depth-FS',
                'Best-FS',
                'Jump-PS',
                'Orthogonal-Jump-PS',
                'Wall-Follower',
                'Pledge',
                'Trémaux',
                'Dead-End-Filling',
                'Maze-Routing'
            ]);
            if (pathFindingAlgorithms.has(params.algorithm)) {
                this.algorithmSelection.set(params.algorithm);

                this.router.navigate([], {
                    relativeTo: this.activatedRoute,
                    queryParams: { algorithm: params.algorithm },
                    queryParamsHandling: 'merge'
                });
            } else {
                this.algorithmSelection.set('Prims');
            }
        });
    }
}
