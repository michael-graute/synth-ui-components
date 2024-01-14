import {Component, Input} from '@angular/core';
import {SequencerStep} from "../sequencer.component";

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
  @Input() id: number = 0;
  @Input() playing: boolean = false;
  @Input() config: SequencerStep = {velocity: 1, pitch: 0, gate: '8n', armed: false, octave: 0, id: 0, duration: '8n'};
  //public playing: boolean = false;

  toggleArmed() {
    this.armed = !this.armed;
  }
}
