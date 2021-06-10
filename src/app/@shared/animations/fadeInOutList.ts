import {
  trigger,
  animate,
  transition,
  style,
  query,
  sequence, state, keyframes
} from '@angular/animations';

/**
 * The animation that is being used for the ngfor in the stats component
 */
export const fadeInOutList = trigger('fadeInOutList', [
  transition(':enter', [
    style({opacity: 0, position: 'fixed'}),
    animate('250ms 200ms ease-in-out', keyframes([
        style({opacity: 0.01, position: 'relative', offset: 0.01}),
        style({opacity: 1, offset: 1}),
      ])
    )]),
  transition(':leave', [
    style({opacity: 1, offset: 0}),
    animate('250ms ease-in-out', keyframes([
      style({opacity: 0.01, offset: 0.99}),
      style({opacity: 0, offset: 1}),
    ])),
  ]),
]);

