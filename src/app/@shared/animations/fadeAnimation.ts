import {
  trigger,
  animate,
  transition,
  style,
  query,
  sequence, state
} from '@angular/animations';

/**
 * The animation for the route main route changes. Yes it is more complicated than it should be but that's cool
 */
export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(':enter', [style({opacity: 0, height: 0})], {optional: true}),
    query(':leave', [style({height: '*'})], {optional: true}),
    query(':leave', [animate('0.15s ease-out', style({opacity: 0, height: '*'}))], {optional: true}),
    query(':leave', [style({height: 0})], {optional: true}),
    query(':enter', [style({height: '*'})], {optional: true}),
    query(':enter', [animate('0.15s 0.15s ease-in'), style({opacity: 1})], {optional: true}),
  ])
]);

export const fadeAnimationSafe = trigger('fadeAnimationSafe', [
  transition('* => *', [
    sequence([
      query(':enter', [style({display: 'none'})], {optional: true}),
      query(':leave', [animate('0.15s')], {optional: true})
    ])
  ])
]);
