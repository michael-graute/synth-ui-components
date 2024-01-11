import {Component, Input} from '@angular/core';

@Component({
  selector: 'ins-sequencer-step',
  templateUrl: './sequencer-step.component.html',
  styleUrl: './sequencer-step.component.scss'
})
export class SequencerStepComponent {
  @Input() active: boolean = false;
  @Input() armed: boolean = false;
  @Input() velocity: number = 0;
  @Input() pitch: number = 0;
  @Input() octave: number = 0;
  @Input() gate: string = '8n';
  @Input() gateOptions: string[] = ['1n', '2n', '4n', '8n', '16n', '32n', '64n'];

  public playing: boolean = false;

  toggleArmed() {
    this.armed = !this.armed;
  }
}
