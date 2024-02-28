import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig, OscillatorConfig} from "../../types/config.types";

export type FmSynthConfig = {
  volume: number;
  active: boolean;
  octave: number;
  harmonicity: number;
  portamento: number;
  detune: number;
  oscillator: OscillatorConfig;
  envelope: ADSREnvelopeConfig;
  modulation: OscillatorConfig;
  modulationEnvelope: ADSREnvelopeConfig;
  modulationIndex: number;
}

@Component({
  selector: 'ins-fm-synth',
  templateUrl: './fm-synth.component.html',
  styleUrl: './fm-synth.component.scss'
})
export class FmSynthComponent extends AbstractSynthComponent<FmSynthConfig> {
  @Input() name: string = 'fm-synth';
  @Input() polyphonic: boolean = false;
  protected override instrument: Tone.FMSynth | Tone.PolySynth = new Tone.FMSynth();
  protected override componentType: string = 'instrument';
  public override config: FmSynthConfig = {
    active: false,
    volume: -15,
    octave: 0,
    harmonicity: 1,
    portamento: 0,
    detune: 0,
    oscillator: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0
    },
    envelope: {
      attack: 5,
      decay: 5,
      sustain: 70,
      release: 5,
    },
    modulation: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0
    },
    modulationEnvelope: {
      attack: 5,
      decay: 5,
      sustain: 70,
      release: 5
    },
    modulationIndex: 10
  }

  override ngOnInit() {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.FMSynth);
    } else {
      this.instrument = new Tone.FMSynth();
    }
    super.ngOnInit();
  }

  get modulationIndex(): number {
    return this.config.modulationIndex;
  }

  set modulationIndex(value: number) {
    this.config.modulationIndex = value;
    this.instrument.set({modulationIndex: value});
  }

  get harmonicity(): number {
    return this.config.harmonicity;
  }

  set harmonicity(value: number) {
    this.config.harmonicity = value;
    this.instrument.set({harmonicity: value});
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

  set modulationType(type: any) {
    this.instrument.set({modulation: {type: type}});
    this.config.modulation.type = type;
  }

  get modulationType(): any {
    return this.config.modulation.type;
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

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

  set envelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
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

  set modulationEnvelope(options: ADSREnvelopeConfig) {
    const newOptions: ADSREnvelopeConfig = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      decay: options.decay as number / 100,
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100
    }
    this.instrument.set({modulationEnvelope: newOptions});
    this.config.modulationEnvelope = options;
  }

  get modulationEnvelope(): any {
    return this.config.modulationEnvelope;
  }


}
