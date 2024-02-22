import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig, FilterConfig, FilterEnvelopeConfig, OscillatorConfig} from "../../types/config.types";

export type MonoSynthConfig = {
  active: boolean;
  volume: number;
  detune: number;
  portamento: number;
  oscillator: OscillatorConfig;
  envelope: ADSREnvelopeConfig;
  filter: FilterConfig;
  filterEnvelope: FilterEnvelopeConfig;

}

@Component({
  selector: 'ins-mono-synth',
  templateUrl: './mono-synth.component.html',
  styleUrl: './mono-synth.component.scss'
})
export class MonoSynthComponent extends AbstractSynthComponent<MonoSynthConfig> {

  @Input() name: string = 'MonoSynth';
  @Input() polyphonic: boolean = true;

  protected override componentType: string = 'instrument';
  protected override instrument: Tone.MonoSynth | Tone.PolySynth = new Tone.MonoSynth();
  public override config: MonoSynthConfig = {
    active: true,
    volume: -15,
    detune: 0,
    portamento: 0,
    oscillator: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 1,
    },
    filter: {
      type: 'lowpass',
      frequency: 350,
      rolloff: -12,
      Q: 1,
      gain: 0,
      detune: 0,
      //active: true
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 1,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2
    }
  }

  override ngOnInit() {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.MonoSynth);
    } else {
      this.instrument = new Tone.MonoSynth();
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

  set volume(value: number) {
    this.instrument.volume.value = value;
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
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

  set filterEnvelope(options: any) {
    const newOptions = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      decay: options.decay as number / 100,
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100
    }
    this.instrument.set({filterEnvelope: newOptions});
    this.config.filterEnvelope = options;
  }

  get filterEnvelope(): any {
    return this.config.filterEnvelope;
  }
}
