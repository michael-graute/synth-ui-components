import {Component, Input} from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import {ADSREnvelopeConfig} from "../../types/config.types";

export interface PolySynthConfig {
  volume: number;
  detune: number;
  active: boolean;
  octave: number;
  pan: number;
  type: string;
  envelope: ADSREnvelopeConfig;
}

@Component({
  selector: 'ins-poly-synth',
  templateUrl: './poly-synth.component.html',
  styleUrls: ['./poly-synth.component.scss']
})
export class PolySynthComponent extends AbstractSynthComponent<PolySynthConfig> {
  @Input() name: string = 'PolySynth'
  protected override componentType: string = 'instrument';
  protected override instrument: Tone.PolySynth = new Tone.PolySynth(Tone.Synth);

  set type(type: any) {
    this.instrument.set({oscillator: {type: type}});
    this.config.type = type;
  }

  get type(): any {
    return this.config.type;
  }

  set volume(value: number) {
    this.instrument.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
   return this.config.volume;
  }

  public override config: PolySynthConfig = {
    volume: -15,
    detune: 0,
    active: true,
    octave: 0,
    type: 'sine',
    pan: 0,
    envelope: {
      attack: 1,
      decay: 10,
      sustain: 30,
      release: 100
    }
  };

  set pan(value: number) {
    this.config.pan = value;
  }

  get pan(): number {
    return this.config.pan;
  }

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

  set detune(value: number) {
    this.instrument.set({detune: value * 10});
    this.config.detune = value;
  }

  get detune(): number {
    return this.config.detune;
  }

  set envelope(options: any) {
    const newOptions = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      decay: options.decay as number / 100,
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100
    }
    this.instrument.set({envelope: newOptions});
    this.config.envelope = options;
  }

  get envelope(): any {
    return this.config.envelope;
  }
}
