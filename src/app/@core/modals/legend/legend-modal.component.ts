import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SimulationService} from '../../services/simulation.service';
import {modalAnimation} from '../../../@shared/animations/modalAnimation';

@Component({
  selector: 'app-legend-modal',
  templateUrl: './legend-modal.component.html',
  styleUrls: ['./legend-modal.component.scss'],
  animations: [modalAnimation]
})
export class LegendModalComponent implements OnInit, OnDestroy {
  showLegend: boolean;

  private readonly destroyed$: Subject<void>;

  constructor(public simulationService: SimulationService, private elementRef: ElementRef) {
    this.showLegend = false;
    console.log('i am a legend');

    this.destroyed$ = new Subject<void>();
  }


  ngOnInit(): void {
    this.simulationService.getLegend().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.showLegend = true;
    });
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
