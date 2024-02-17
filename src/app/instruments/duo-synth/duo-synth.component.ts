import {Component, Input} from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import {ADSREnvelopeConfig, FilterConfig, OscillatorConfig} from "../../types/config.types";

export type DuoSynthConfig = {
  voice0: {
    oscillator: OscillatorConfig;
    envelope: ADSREnvelopeConfig;
    filter: FilterConfig;
    filterEnvelope: ADSREnvelopeConfig;
    frequency: number;
    portamento: number;
    detune: number;
  }
  voice1: {
    oscillator: OscillatorConfig;
    envelope: ADSREnvelopeConfig;
    filter: FilterConfig;
    filterEnvelope: ADSREnvelopeConfig;
    frequency: number;
    portamento: number;
    detune: number;
  },
  detune: number;
  frequency: number;
  harmonicity: number;
  portamento: number;
  vibratoAmount: number;
  vibratoRate: number;
  volume: number;
  active: boolean;
  octave: number;
}

@Component({
  selector: 'ins-duo-synth',
  templateUrl: './duo-synth.component.html',
  styleUrl: './duo-synth.component.scss'
})
export class DuoSynthComponent extends AbstractSynthComponent<DuoSynthConfig> {

  protected override componentType: string = 'instrument';
  protected override instrument: Tone.DuoSynth = new Tone.DuoSynth();
  @Input() name: string = 'DuoSynth';

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set voice1Type(type: any) {
    this.instrument.voice0.set({oscillator: {type: type}});
    this.config.voice1.oscillator.type = type;
  }

  get voice1Type(): any {
    return this.config.voice1.oscillator.type;
  }

  set voice1Volume(value: number) {
    this.instrument.voice0.oscillator.set({volume: value});
    this.config.voice1.oscillator.volume = value;
  }

  get voice1Volume(): number {
   return this.config.voice1.oscillator.volume;
  }

  public override config: DuoSynthConfig = {
    active: true,
    octave: 0,
    voice0: {
      oscillator: {
        type: 'sine',
        volume: -15,
        detune: 0,
        active: true,
        octave: 0,
        pan: 0,
      },
      envelope: {
        attack: 1,
        decay: 10,
        sustain: 30,
        release: 100
      },
      filter: {
        type: 'lowpass',
        detune: 0,
        frequency: 0,
        gain: 0,
        input: 0,
        q: 0
      },
      filterEnvelope: {
        attack: 1,
        decay: 10,
        sustain: 30,
        release: 100
      },
      frequency: 0,
      portamento: 0,
      detune: 0
    },
    voice1: {
      oscillator: {
        type: 'sine',
        volume: -15,
        detune: 0,
        active: true,
        octave: 0,
        pan: 0
      },
      envelope: {
        attack: 1,
        decay: 10,
        sustain: 30,
        release: 100
      },
      filter: {
        type: 'lowpass',
        detune: 0,
        frequency: 0,
        gain: 0,
        input: 0,
        q: 0
      },
      filterEnvelope: {
        attack: 1,
        decay: 10,
        sustain: 30,
        release: 100
      },
      frequency: 0,
      portamento: 0,
      detune: 0
    },
    detune: 0,
    frequency: 0,
    harmonicity: 0,
    portamento: 0,
    vibratoAmount: 0,
    vibratoRate: 0,
    volume: -15
  };

}
