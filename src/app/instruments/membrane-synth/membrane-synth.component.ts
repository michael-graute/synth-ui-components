import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig, OscillatorConfig} from "../../types/config.types";

export type MembraneSynthConfig = {
  volume: number;
  active: boolean;
  pitchDecay: number;
  octaves: number;
  detune: number;
  octave: number;
  oscillator: OscillatorConfig
  envelope: ADSREnvelopeConfig
}

@Component({
  selector: 'ins-membrane-synth',
  templateUrl: './membrane-synth.component.html',
  styleUrl: './membrane-synth.component.scss'
})
export class MembraneSynthComponent extends AbstractSynthComponent<MembraneSynthConfig>{
  @Input() name: string = 'MembraneSynth';
  @Input() polyphonic: boolean = false;
  protected override componentType: string = 'instrument';
  protected override instrument: Tone.MembraneSynth | Tone.PolySynth<Tone.MembraneSynth> = new Tone.MembraneSynth();
  public override config: MembraneSynthConfig = {
    volume: -15,
    active: false,
    pitchDecay: 0.05,
    octaves: 10,
    octave: 0,
    detune: 0,
    oscillator: {
      type: 'sine',
      volume: -15
    },
    envelope: {
      attack: 1,
      decay: 40,
      sustain: 1,
      release: 14
    }
  }

  override ngOnInit(): void {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.MembraneSynth);
    }
    super.ngOnInit();
  }

  set pitchDecay(value: number) {
    this.instrument.set({pitchDecay: value});
    this.config.pitchDecay = value;
  }

  get pitchDecay(): number {
    return this.config.pitchDecay;
  }

  set octaves(value: number) {
    this.instrument.set({octaves: value});
    this.config.octaves = value;
  }

  get octaves(): number {
    return this.config.octaves;
  }

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

  set type(type: any) {
    this.instrument.set({oscillator: {type: type}});
    this.config.oscillator.type = type;
  }

  get type(): any {
    return this.config.oscillator.type;
  }

  set volume(value: number) {
    this.instrument.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set envelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      attackCurve: options.attackCurve || "exponential",
      decay: options.decay as number / 100,
      decayCurve: options.decayCurve || "exponential",
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100,
      releaseCurve: options.releaseCurve || "exponential"
    }
    this.instrument.set({envelope: newOptions});
    this.config.envelope = options;
  }

  get envelope(): any {
    return this.config.envelope;
  }

  set detune(value: number) {
    this.instrument.set({detune: value});
    this.config.oscillator.detune = value;
  }

  get detune(): number {
    return this.config.detune;
  }
}
