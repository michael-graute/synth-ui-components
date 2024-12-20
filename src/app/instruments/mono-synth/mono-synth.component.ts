import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig, FilterConfig, FilterEnvelopeConfig, OscillatorConfig} from "../../types/config.types";
import {FilterRollOff} from "tone";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { DividerComponent } from '../../ui-elements/divider/divider.component';
import { WaveformSelectComponent } from '../../ui-elements/waveform-select/waveform-select.component';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';
import { AdsrEnvelopeComponent } from '../../ui-elements/adsr-envelope/adsr-envelope.component';
import { ButtonGroupComponent } from '../../ui-elements/button-group/button-group.component';

export type MonoSynthConfig = {
  active: boolean;
  volume: number;
  detune: number;
  portamento: number;
  octave: number;
  oscillator: OscillatorConfig;
  envelope: ADSREnvelopeConfig;
  filter: FilterConfig;
  filterEnvelope: FilterEnvelopeConfig;

}

@Component({
    selector: 'ins-mono-synth',
    templateUrl: './mono-synth.component.html',
    styleUrl: './mono-synth.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, DividerComponent, WaveformSelectComponent, KnobComponent, MidiOverlayComponent, AdsrEnvelopeComponent, ButtonGroupComponent]
})
export class MonoSynthComponent extends AbstractSynthComponent<MonoSynthConfig> {

  @Input() name: string = 'MonoSynth';
  @Input() polyphonic: boolean = true;

  protected override componentType: string = 'instrument';
  protected override instrument: Tone.MonoSynth | Tone.PolySynth = new Tone.MonoSynth();
  public override config: MonoSynthConfig = {
    active: false,
    volume: -15,
    detune: 0,
    portamento: 0,
    octave: 0,
    oscillator: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0,
      phase: 0
    },
    envelope: {
      attack: 70,
      decay: 10,
      sustain: 70,
      release: 10,
    },
    filter: {
      type: 'lowpass',
      frequency: 350,
      rolloff: 0,
      Q: 10,
      gain: 10,
      detune: 0,
      //active: true
    },
    filterEnvelope: {
      attack: 70,
      decay: 10,
      sustain: 70,
      release: 10,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2
    }
  }

  rolloffOptions: FilterRollOff[] = [-12, -24, -48, -96];

  override ngOnInit() {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.MonoSynth);
    } else {
      this.instrument = new Tone.MonoSynth();
    }
    super.ngOnInit();
  }



  set type(type: any) {
    this.instrument.set({oscillator: {type: type}});
    this.config.oscillator.type = type;
  }

  get type(): any {
    return this.config.oscillator.type;
  }

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

  set volume(value: number) {
    this.instrument.volume.value = value;
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }

  set detune(value: number) {
    this.instrument.set({detune: value * 10});
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

  set phase(value: number) {
    this.instrument.set({oscillator: {phase: value}});
    this.config.oscillator.phase = value;
  }

  get phase(): number {
    return this.config.oscillator.phase || 0;
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

  set filter(options: FilterConfig) {
    //this.instrument.set({filter: options});
    this.config.filter = options;
  }

  get filter(): any {
    return this.config.filter;
  }

  set filterType(type: any) {
    this.instrument.set({filter: {type: type}});
    this.config.filter.type = type;
  }

  get filterType(): any {
    return this.config.filter.type;
  }

  set filterFrequency(value: number) {
    this.instrument.set({filter: {frequency: value}});
    this.config.filter.frequency = value;
  }

  get filterFrequency(): number {
    return this.config.filter.frequency;
  }

  set filterQ(value: number) {
    this.instrument.set({filter: {Q: value}});
    this.config.filter.Q = value;
  }

  get filterQ(): number {
    return this.config.filter.Q;
  }

  set filterGain(value: number) {
    this.instrument.set({filter: {gain: value}});
    this.config.filter.gain = value;
  }

  get filterGain(): number {
    return this.config.filter.gain;
  }

  set filterRolloff(value: number) {
    this.instrument.set({filter: {rolloff: this.rolloffOptions[value]}});
    this.config.filter.rolloff = value;
  }

  get filterRolloff(): number {
    return this.config.filter.rolloff;
  }

  set filterEnvelope(options: FilterEnvelopeConfig) {
    const newOptions: FilterEnvelopeConfig = {
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
