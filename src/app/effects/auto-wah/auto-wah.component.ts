import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';

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
  styleUrl: './auto-wah.component.scss'
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

  set active(active: boolean) {
    this.config.active = active;
    if(this.config.active) {
      this.synthService.addEffect(this.id, this.instrument, this.config);
    } else {
      this.synthService.removeEffect(this.id);
    }
  }

  get active(): boolean {
    return this.config.active;
  }

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
