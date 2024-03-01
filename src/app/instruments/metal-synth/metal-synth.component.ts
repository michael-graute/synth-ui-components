import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig} from "../../types/config.types";

export type MetalSynthConfig = {
  active: boolean;
  volume: number,
  detune: number,
  portamento: number,
  envelope: ADSREnvelopeConfig,
  harmonicity: number,
  modulationIndex: number,
  octaves: number,
  resonance: number
};

@Component({
  selector: 'ins-metal-synth',
  templateUrl: './metal-synth.component.html',
  styleUrl: './metal-synth.component.scss'
})
export class MetalSynthComponent extends AbstractSynthComponent<MetalSynthConfig>{
  @Input() name: string = 'MetalSynth';
  @Input() polyphonic: boolean = false;
  protected override componentType: string = 'instrument';
  protected override instrument: Tone.MetalSynth | Tone.PolySynth<Tone.MetalSynth> = new Tone.MetalSynth();

  public override config: MetalSynthConfig = {
    active: false,
    volume: 0,
    detune: 0,
    portamento: 0,
    envelope: {
      attack: 1,
      attackCurve: 'linear',
      decay: 10,
      decayCurve: 'exponential',
      release: 1,
      releaseCurve: 'exponential',
      sustain: 0
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    octaves: 1.5,
    resonance: 4000
  }

  override ngOnInit(): void {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.MetalSynth);
    }
    super.ngOnInit();
  }

  set harmonicity(value: number) {
    this.instrument.set({harmonicity: value});
    this.config.harmonicity = value;
  }

  get harmonicity(): number {
    return this.config.harmonicity;
  }

  set modulationIndex(value: number) {
    this.instrument.set({modulationIndex: value});
    this.config.modulationIndex = value;
  }

  get modulationIndex(): number {
    return this.config.modulationIndex;
  }

  set octaves(value: number) {
    this.instrument.set({octaves: value});
    this.config.octaves = value;
  }

  get octaves(): number {
    return this.config.octaves;
  }

  set resonance(value: number) {
    this.instrument.set({resonance: value});
    this.config.resonance = value;
  }

  get resonance(): number {
    return this.config.resonance;
  }

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set volume(value: number) {
    this.instrument.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }

  set detune(value: number) {
    this.instrument.set({detune: value});
    this.config.detune = value;
  }

  get detune(): number {
    return this.config.detune;
  }

  set portamento(value: number) {
    this.instrument.set({portamento: value});
    this.config.portamento = value;
  }

  get portamento(): number {
    return this.config.portamento;
  }

  set envelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      attackCurve: options.attackCurve || "linear",
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

}
