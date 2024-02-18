import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {OscillatorConfig} from "../../types/config.types";

export type AmSynthConfig = {
  volume: number;
  active: boolean;
  octave: number;
  harmonicity: number;
  oscillator: OscillatorConfig;
}

@Component({
  selector: 'ins-am-synth',
  templateUrl: './am-synth.component.html',
  styleUrl: './am-synth.component.scss'
})
export class AmSynthComponent extends AbstractSynthComponent<AmSynthConfig> {

  @Input() name: string = 'AmSynth';
  @Input() polyphonic: boolean = true;

  protected override componentType: string = 'instrument';
  protected override instrument: Tone.PolySynth | Tone.AMSynth = new Tone.PolySynth(Tone.AMSynth);
  override config: AmSynthConfig = {
    volume: -15,
    active: true,
    octave: 0,
    harmonicity: 1,
    oscillator: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0
    }
  }

  override ngOnInit() {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.AMSynth);
    } else {
      this.instrument = new Tone.AMSynth();
    }
    super.ngOnInit();
  }

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set type(type: any) {
    this.instrument.set({oscillator: {type: type}});
    this.config.oscillator.type = type;
  }
  get type(): any {
    return this.config.oscillator.type;
  }

  set harmonicity(value: number) {
    this.instrument.set({harmonicity: value});
    this.config.harmonicity = value;
  }

  get harmonicity(): number {
    return this.config.harmonicity;
  }

}
