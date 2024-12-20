import {Component, Input} from '@angular/core';
import { AbstractSynthComponent } from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig} from "../../types/config.types";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { DividerComponent } from '../../ui-elements/divider/divider.component';
import { ButtonGroupComponent } from '../../ui-elements/button-group/button-group.component';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';
import { AdsrEnvelopeComponent } from '../../ui-elements/adsr-envelope/adsr-envelope.component';

export type NoiseSynthConfig = {
  triggerWithoutNote: boolean;
  active: boolean;
  volume: number;
  octave: number;
  noise: {
    type: string;
    playbackRate: number;
    fadeIn: number;
    fadeOut: number;
  }
  envelope: ADSREnvelopeConfig
}

@Component({
    selector: 'ins-noise-synth',
    templateUrl: './noise-synth.component.html',
    styleUrl: './noise-synth.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, DividerComponent, ButtonGroupComponent, KnobComponent, MidiOverlayComponent, AdsrEnvelopeComponent]
})
export class NoiseSynthComponent extends AbstractSynthComponent<NoiseSynthConfig> {
  @Input() name: string = 'NoiseSynth';
  protected override componentType: string = 'instrument';
  protected override instrument: Tone.NoiseSynth = new Tone.NoiseSynth();
  public override config: NoiseSynthConfig = {
    triggerWithoutNote: true,
    active: false,
    volume: -15,
    octave: 0,
    noise: {
      type: 'white',
      playbackRate: 1,
      fadeIn: 0,
      fadeOut: 0
    },
    envelope: {
      attack: 1,
      decay: 10,
      sustain: 0,
      release: 0
    }
  };

  set volume(value: number) {
    this.instrument.volume.value = value;
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

  set noiseType(value: any) {
    this.instrument.set({noise: {type: value}});
    this.config.noise.type = value;
  }

  get noiseType(): string {
    return this.config.noise.type;
  }

  set playbackRate(value: number) {
    this.instrument.set({noise: {playbackRate: value}});
    this.config.noise.playbackRate = value;
  }

  get playbackRate(): number {
    return this.config.noise.playbackRate;
  }

  set fadeIn(value: number) {
    this.instrument.set({noise: {fadeIn: value}});
    this.config.noise.fadeIn = value;
  }

  get fadeIn(): number {
    return this.config.noise.fadeIn;
  }

  set fadeOut(value: number) {
    this.instrument.set({noise: {fadeOut: value}});
    this.config.noise.fadeOut = value;
  }

  get fadeOut(): number {
    return this.config.noise.fadeOut;
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

}
