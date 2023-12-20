import {Component, Input} from '@angular/core';
import * as Tone from "tone";
import {RecursivePartial} from "tone/build/esm/core/util/Interface";

@Component({
  selector: 'ins-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.scss']
})
export class OscillatorComponent {
  public envelopeOptions: RecursivePartial<Omit<Tone.EnvelopeOptions, "context">> = {
    attack: 3,
    decay: 10,
    sustain: .5,
    release: 10
  };
  @Input() synth: Tone.Synth = new Tone.Synth({oscillator: {type: 'sawtooth'}, envelope: this.envelopeOptions});
  @Input() name: string = 'Oscillator'

  connectTo(destination: any): void {
    this.synth.connect(destination);
  }

  disconnectFrom(destination: any): void {
    this.synth.disconnect(destination);
  }
}
