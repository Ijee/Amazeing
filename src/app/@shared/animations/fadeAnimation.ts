import {
  trigger,
  animate,
  transition,
  style,
  query,
  sequence
} from '@angular/animations';

/**
 * The animation for the route main route changes. Yes it is more complicated than it should be but that's cool
 */
export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [style({opacity: 0, height: 0})],
      {optional: true}
    ),
    sequence([
      query(':leave', [animate('0.25s ease-out', style({opacity: 0, height: '*'}))], {optional: true}),
      query(':leave', [style({height: 0})], {optional: true}),
    ]),
    sequence([
      query(':enter', [style({height: '*'})], {optional: true}),
      query(':enter', [animate('0.25s 0.25s ease-in'), style({opacity: 1})], {optional: true}),
    ])
  ])
]);
