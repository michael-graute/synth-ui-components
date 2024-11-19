import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type AutoWahConfig = {
  active: boolean;
  baseFrequency: number;
  octaves: number;
  Q: number;
  sensitivity: number;
  gain: number;
  follower: number;
  wet: number;
};

@Component({
    selector: 'ins-auto-wah',
    templateUrl: './auto-wah.component.html',
    styleUrl: './auto-wah.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, KnobComponent, MidiOverlayComponent]
})
export class AutoWahComponent extends AbstractSynthComponent<AutoWahConfig> {

  protected override instrument: Tone.AutoWah = new Tone.AutoWah();
  protected override componentType: string = 'effect';
  public override config: AutoWahConfig = {
    active: false,
    baseFrequency: 100,
    octaves: 6,
    Q: 2,
    sensitivity: 0,
    gain: 2,
    follower: 0.2,
    wet: 1,
  };

  set baseFrequency(baseFrequency: number) {
    this.instrument.set({baseFrequency: baseFrequency});
    this.config.baseFrequency = baseFrequency;
  }

  get baseFrequency(): number {
    return this.config.baseFrequency;
  }

  set octaves(octaves: number) {
    this.instrument.set({octaves: octaves});
    this.config.octaves = octaves;
  }

  get octaves(): number {
    return this.config.octaves;
  }

  set Q(Q: number) {
    this.instrument.set({Q: Q});
    this.config.Q = Q;
  }

  get Q(): number {
    return this.config.Q;
  }

  set sensitivity(sensitivity: number) {
    this.instrument.set({sensitivity: sensitivity});
    this.config.sensitivity = sensitivity;
  }

  get sensitivity(): number {
    return this.config.sensitivity;
  }

  set gain(gain: number) {
    this.instrument.set({gain: gain});
    this.config.gain = gain;
  }

  get gain(): number {
    return this.config.gain;
  }

  set follower(follower: number) {
    this.instrument.set({follower: follower});
    this.config.follower = follower;
  }

  get follower(): number {
    return this.config.follower;
  }

  set wet(wet: number) {
    this.instrument.set({wet: wet});
    this.config.wet = wet;
  }

  get wet(): number {
    return this.config.wet;
  }

}
