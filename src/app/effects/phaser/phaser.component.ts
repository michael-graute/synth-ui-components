import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";

export type PhaserConfig = {
  active: boolean,
  wet: number,
  frequency: number,
  octaves: number,
  stages: number,
  Q: number,
  baseFrequency: number
};

@Component({
  selector: 'ins-phaser',
  templateUrl: './phaser.component.html',
  styleUrl: './phaser.component.scss'
})
export class PhaserComponent extends AbstractSynthComponent<PhaserConfig> {

  public override instrument: Tone.Phaser = new Tone.Phaser();
  public override componentType: string = 'effect';
  public override config: PhaserConfig = {
    active: false,
    wet: 1,
    frequency: 0.5,
    octaves: 3,
    stages: 10,
    Q: 10,
    baseFrequency: 350
  }

  set baseFrequency(value: number) {
    this.instrument.set({baseFrequency: value});
    this.config.baseFrequency = value;
  }

  get baseFrequency(): number {
    return this.config.baseFrequency;
  }

  set frequency(value: number) {
    this.instrument.set({frequency: value});
    this.config.frequency = value;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  set octaves(value: number) {
    this.instrument.set({octaves: value});
    this.config.octaves = value;
  }

  get octaves(): number {
    return this.config.octaves;
  }

  set Q(value: number) {
    this.instrument.set({Q: value});
    this.config.Q = value;
  }

  get Q(): number {
    return this.config.Q;
  }

  set stages(value: number) {
    this.instrument.set({stages: value});
    this.config.stages = value;
  }

  get stages(): number {
    return this.config.stages;
  }

  set wet(value: number) {
    this.instrument.set({wet: value});
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }
}
