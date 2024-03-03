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

  public override config: DuoSynthConfig = {
    active: false,
    octave: 0,
    detune: 0,
    frequency: 0,
    harmonicity: 1.5,
    portamento: 0,
    vibratoAmount: 0.5,
    vibratoRate: 5,
    volume: -15,
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
        Q: 0,
        rolloff: -12
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
        Q: 0,
        rolloff: -12
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
    }
  };



  set detune(value: number) {
    this.instrument.set({detune: value});
    this.config.detune = value;
  }

  get detune(): number {
    return this.config.detune;
  }

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

  set voice1Type(type: any) {
    this.instrument.voice0.set({oscillator: {type: type}});
    this.config.voice0.oscillator.type = type;
  }

  get voice1Type(): any {
    return this.config.voice0.oscillator.type;
  }

  set voice1Phase(phase: number) {
    this.instrument.voice0.set({oscillator: {phase: phase}});
    this.config.voice0.oscillator.phase = phase;
  }

  get voice1Phase(): number {
    return this.config.voice0.oscillator.phase || 0;
  }

  set voice1Detune(detune: number) {
    this.instrument.voice0.oscillator.set({detune: detune});
    this.config.voice0.detune = detune;
  }

  get voice1Detune(): number {
    return this.config.voice0.detune;
  }

  set voice2Phase(phase: number) {
    this.instrument.voice1.set({oscillator: {phase: phase}});
    this.config.voice1.oscillator.phase = phase;
  }

  get voice2Phase(): number {
    return this.config.voice1.oscillator.phase || 0;
  }

  set voice2Detune(detune: number) {
    this.instrument.voice1.oscillator.set({detune: detune});
    this.config.voice0.detune = detune;
  }

  get voice2Detune(): number {
    return this.config.voice1.detune;
  }

  set voice2Type(type: any) {
    this.instrument.voice1.set({oscillator: {type: type}});
    this.config.voice1.oscillator.type = type;
  }

  get voice2Type(): any {
    return this.config.voice1.oscillator.type;
  }

  set volume(value: number) {
    this.instrument.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
   return this.config.volume;
  }

  set vibratoAmount(value: number) {
    this.instrument.set({vibratoAmount: value});
    this.config.vibratoAmount = value;
  }

  get vibratoAmount(): number {
    return this.config.vibratoAmount;
  }

  set vibratoRate(value: number) {
    this.instrument.set({vibratoRate: value});
    this.config.vibratoRate = value;
  }

  get vibratoRate(): number {
    return this.config.vibratoRate;
  }

  set portamento(value: number) {
    this.instrument.set({portamento: value});
    this.config.portamento = value;
  }

  get portamento(): number {
    return this.config.portamento;
  }

  set harmonicity(value: number) {
    this.instrument.set({harmonicity: value});
    this.config.harmonicity = value;
  }

  get harmonicity(): number {
    return this.config.harmonicity;
  }

  set voice1Envelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      attackCurve: options.attackCurve || "linear",
      decay: options.decay as number / 100,
      decayCurve: options.decayCurve || "exponential",
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100,
      releaseCurve: options.releaseCurve || "exponential"
    }
    this.instrument.set({voice0: {envelope: newOptions}});
    this.config.voice0.envelope = options;
  }

  get voice1Envelope(): any {
    return this.config.voice0.envelope;
  }

  set voice1FilterEnvelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      attackCurve: options.attackCurve || "linear",
      decay: options.decay as number / 100,
      decayCurve: options.decayCurve || "exponential",
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100,
      releaseCurve: options.releaseCurve || "exponential"
    }
    this.instrument.set({voice0: {filterEnvelope: newOptions}});
    this.config.voice0.filterEnvelope = options;
  }

  get voice1FilterEnvelope(): any {
    return this.config.voice0.filterEnvelope;
  }

  set voice2Envelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      attackCurve: options.attackCurve || "linear",
      decay: options.decay as number / 100,
      decayCurve: options.decayCurve || "exponential",
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100,
      releaseCurve: options.releaseCurve || "exponential"
    }
    this.instrument.set({voice1: {envelope: newOptions}});
    this.config.voice1.envelope = options;
  }

  get voice2Envelope(): any {
    return this.config.voice1.envelope;
  }

  set voice2FilterEnvelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      attackCurve: options.attackCurve || "linear",
      decay: options.decay as number / 100,
      decayCurve: options.decayCurve || "exponential",
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100,
      releaseCurve: options.releaseCurve || "exponential"
    }
    this.instrument.set({voice1: {filterEnvelope: newOptions}});
    this.config.voice1.filterEnvelope = options;
  }

  get voice2FilterEnvelope(): any {
    return this.config.voice1.filterEnvelope;
  }

}
