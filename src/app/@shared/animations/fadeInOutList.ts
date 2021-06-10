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
    style({opacity: 0, visibility: 'hidden', transform: 'translateY(5px)',  position: 'fixed'}),
    animate('225ms 225ms ease-in', keyframes([
        style({opacity: 0.01, position: 'relative', visibility: 'visible', offset: 0.01}),
        style({opacity: 1, transform: 'translateY(0px)', offset: 1}),
      ])
    )]),
  transition(':leave', [
    style({opacity: 1, offset: 0}),
    animate('225ms ease-out', keyframes([
      style({opacity: 0.01, offset: 0.99}),
      style({opacity: 0, transform: 'translateY(50px)', offset: 1}),
    ])),
  ]),
]);

