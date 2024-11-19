import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import {PolySynth, AMSynth} from "tone";
import {ADSREnvelopeConfig, OscillatorConfig} from "../../types/config.types";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { DividerComponent } from '../../ui-elements/divider/divider.component';
import { WaveformSelectComponent } from '../../ui-elements/waveform-select/waveform-select.component';
import { AdsrEnvelopeComponent } from '../../ui-elements/adsr-envelope/adsr-envelope.component';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';
import { NgIf, JsonPipe } from '@angular/common';
import { WindowComponent } from '../../ui-elements/window/window.component';

export type AmSynthConfig = {
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
}

@Component({
    selector: 'ins-am-synth',
    templateUrl: './am-synth.component.html',
    styleUrl: './am-synth.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, DividerComponent, WaveformSelectComponent, AdsrEnvelopeComponent, KnobComponent, MidiOverlayComponent, NgIf, WindowComponent, JsonPipe]
})
export class AmSynthComponent extends AbstractSynthComponent<AmSynthConfig> {

  @Input() name: string = 'AmSynth';
  @Input() polyphonic: boolean = true;

  protected override componentType: string = 'instrument';
  protected override instrument: PolySynth | AMSynth = new PolySynth(AMSynth);
  override config: AmSynthConfig = {
    volume: -15,
    active: false,
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
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 1,
    },
    modulation: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 0.5
    }
  }

  override ngOnInit() {
    if(this.polyphonic) {
      this.instrument = new PolySynth(AMSynth);
    } else {
      this.instrument = new AMSynth();
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

  set modulationType(type: any) {
    this.instrument.set({modulation: {type: type}});
    this.config.modulation.type = type;
  }
  get modulationType(): any {
    return this.config.modulation.type;
  }

  set harmonicity(value: number) {
    this.instrument.set({harmonicity: value});
    this.config.harmonicity = value;
  }

  get harmonicity(): number {
    return this.config.harmonicity;
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

  connectLFOToVolume(lfoId: string): void {
    if (this.instrument instanceof AMSynth) {
      this.synthService.connectLFO(lfoId, this.instrument.harmonicity);
    }
  }

  disconnectLFOFromVolume(lfoId: string): void {
    if (this.instrument instanceof AMSynth) {
      this.synthService.disconnectLFO(lfoId, this.instrument.harmonicity);
    }
  }

}
