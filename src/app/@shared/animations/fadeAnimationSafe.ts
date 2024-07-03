import { animate, query, sequence, style, transition, trigger } from '@angular/animations';

export const fadeAnimationSafe = trigger('fadeAnimationSafe', [
    transition('* => *', [
        sequence([
            query(':enter', [style({ display: 'none' })], { optional: true }),
            query(':leave', [animate('0s')], { optional: true })
        ])
    ])
]);
