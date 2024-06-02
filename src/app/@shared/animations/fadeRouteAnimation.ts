import { animate, query, sequence, style, transition, trigger } from '@angular/animations';

/**
 * The animation for the route main route changes. Yes it is more complicated than it should be but that's cool
 */
export const fadeRouteAnimation = trigger('fadeRouteAnimation', [
    transition('* <=> *', [
        style({ position: 'relative' }),
        query(
            ':enter, :leave',
            [
                style({
                    position: 'absolute',
                    width: 'calc(100% - 1.47rem)'
                })
            ],
            { optional: true }
        ),
        query(':enter', [style({ opacity: 0 })], { optional: true }),
        query(':leave', [style({ opacity: 1 })], { optional: true }),
        query(':leave', [animate('225ms ease-out', style({ opacity: 0 }))], {
            optional: true
        }),
        query(':enter', [animate('225ms 225ms ease-out', style({ opacity: 1 }))], {
            optional: true
        }),
        // fixes child-route collapse before :leave animation ends
        // see: https://github.com/angular/angular/issues/15477#issuecomment-377619882
        query(':leave *', [style({}), animate(1, style({}))])
    ])
]);

export const fadeAnimationSafe = trigger('fadeAnimationSafe', [
    transition('* => *', [
        sequence([
            query(':enter', [style({ display: 'none' })], { optional: true }),
            query(':leave', [animate('0s')], { optional: true })
        ])
    ])
]);
