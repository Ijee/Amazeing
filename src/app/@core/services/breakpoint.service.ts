import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

export const AmazeingBreakpoints: Record<string, string> = {
    mobile: '(max-width:768px)',
    tablet: '(min-width:769px) and (max-width:1023px)',
    desktop: '(min-width:1024px) and (max-width:1216px)',
    widescreen: '(min-width:1217px) and (max-width:1407px)',
    fullhd: '(min-width:1408px)'
} as const;

@Injectable({ providedIn: 'root' })
export class BreakpointService {
    // Taken from https://bulma.io/documentation/start/responsiveness/
    // Touch means everything below in touch + mobile
    private mobile: string;
    private tablet: string;
    private touch: string;
    private desktop: string;
    private widescreen: string;
    private fullhd: string;

    private breakpointState$: Observable<BreakpointState> | undefined;

    constructor(private breakpointObserver: BreakpointObserver) {
        this.mobile = '(max-width:768px)';
        this.tablet = '(min-width:769px) and (max-width:1023px)';
        this.touch = '(max-width:1023px)';
        this.desktop = '(min-width:1024px) and (max-width:1216px)';
        this.widescreen = '(min-width:1217px) and (max-width:1407px)';
        this.fullhd = '(min-width:1408px)';

        this.breakpointState$ = this.breakpointObserver
            .observe([
                this.mobile,
                this.tablet,
                this.touch,
                this.desktop,
                this.widescreen,
                this.fullhd
            ])
            .pipe(
                shareReplay(1) // Share the subscription among multiple subscribers
            );
    }

    public getBreakpointState(): Observable<BreakpointState> {
        return this.breakpointState$;
    }

    public isMobile(): Observable<boolean> {
        return this.getBreakpointState().pipe(
            map((state) => state.matches && state.breakpoints[this.mobile])
        );
    }

    public isTablet(): Observable<boolean> {
        return this.getBreakpointState().pipe(
            map((state) => state.matches && state.breakpoints[this.tablet])
        );
    }

    public isTouch(): Observable<boolean> {
        return this.getBreakpointState().pipe(
            map((state) => state.matches && state.breakpoints[this.touch])
        );
    }

    public isDesktop(): Observable<boolean> {
        return this.getBreakpointState().pipe(
            map((state) => state.matches && state.breakpoints[this.desktop])
        );
    }

    public isWidescreen(): Observable<boolean> {
        return this.getBreakpointState().pipe(
            map((state) => state.matches && state.breakpoints[this.widescreen])
        );
    }

    public isFullHD(): Observable<boolean> {
        return this.getBreakpointState().pipe(
            map((state) => state.matches && state.breakpoints[this.fullhd])
        );
    }
}
