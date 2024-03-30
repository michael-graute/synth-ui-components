import {Component, Input} from '@angular/core';
import {SequencerStep} from "../sequencer.component";
import {v4 as uuidv4} from 'uuid';

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
  @Input() id: string = uuidv4();
  @Input() playing: boolean = false;
  @Input() config: SequencerStep = {velocity: 1, pitch: 0, gate: 3, armed: false, octave: 0, id: 0, duration: '8n'};
  @Input() keyboardConnected: boolean = false;
  //public playing: boolean = false;
  gateValue = 3;
  noteOptions: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G','G#', 'A', 'A#', 'B'];
  toggleArmed() {
    this.armed = !this.armed;
  }
}
