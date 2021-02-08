import {
  trigger,
  animate,
  transition,
  style, state
} from '@angular/animations';


/**
 * The animation for modals to show up and out
 */
export const modalAnimation = trigger('modalAnimation', [
  state('true', style({opacity: 1})),
  state('false', style({opacity: 0})),
  transition('false <=> true', animate('0.25s ease-in-out'))
]);

