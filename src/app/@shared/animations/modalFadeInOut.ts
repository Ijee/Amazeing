import { animate, keyframes, style, transition, trigger } from '@angular/animations';

/**
 * The animation that is being used for the ngfor in the stats component
 */
export const modalFadeInOut = trigger('modalFadeInOut', [
    transition(':enter', [
        style({ opacity: 0, offset: 0 }),
        animate(
            '150ms ease-in-out',
            keyframes([style({ opacity: 0.01, offset: 0.01 }), style({ opacity: 1, offset: 1 })])
        )
    ]),
    transition(':leave', [
        animate(
            '150ms ease-in-out',
            keyframes([
                style({ opacity: 1, display: 'block', offset: 0 }),
                style({ opacity: 0.01, offset: 0.99 }),
                style({ opacity: 0, display: 'none', offset: 1 })
            ])
        )
    ])
]);
