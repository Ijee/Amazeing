import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appCountAnimation]'
})
export class CountAnimationDirective implements OnChanges {
  @Input() newValue: number;
  @Input() duration: number;
  @Input() disableAnimation: boolean;

  private readonly refreshInterval: number;
  private intervalID: number;


  constructor(private elementRef: ElementRef) {
    this.newValue = 0;
    // the duration in which the 'animation' has to be done
    this.duration = 300;
    this.disableAnimation = false;
    this.refreshInterval = 30;
  }

  /**
   * Uses Angular SimpleChanges to trigger the function.
   * It determines the new steps to show the new number
   * in increments to make it look like an animation.
   *
   * Also deals with negative values
   *
   * @param changes - the new values
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.newValue) {
      clearInterval(this.intervalID);
      if (this.disableAnimation) {
        this.currentValue = this.newValue;
      } else {
        const steps = Math.floor(this.duration / this.refreshInterval);
        const increment = (this.newValue - this.currentValue) / steps;
        let step = 0;
        let internalValue = this.currentValue;
        this.intervalID = setInterval(() => {
          step++;
          if (step === steps - 1) {
            this.currentValue = this.newValue;
            clearInterval(this.intervalID);
          } else {
            internalValue += increment;
            this.currentValue = Math.floor(internalValue);
          }
        }, this.refreshInterval);
      }
    }
  }

  private get currentValue(): number {
    return +this.elementRef.nativeElement.innerHTML;
  }

  private set currentValue(val: number) {
    this.elementRef.nativeElement.innerHTML = val;
  }
}
