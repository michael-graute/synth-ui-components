import { Component } from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../abstracts/abstract-synth.component";

export type ReverbConfig = {
  active: boolean;
  decay: number;
  wet: number;
}

@Component({
  selector: 'ins-reverb',
  templateUrl: './reverb.component.html',
  styleUrl: './reverb.component.scss'
})
export class ReverbComponent extends AbstractSynthComponent<ReverbConfig> {

  reverb: Tone.Reverb = new Tone.Reverb({decay: 2.5, wet: 0.8});

  public override config: ReverbConfig = {
    active: true,
    decay: 2.5,
    wet: 0.8
  }

  set decay(value: number) {
    this.reverb.decay = value;
    this.config.decay = value;
  }

  get decay(): number {
    return this.config.decay;

  }

  set wet(value: number) {
    this.reverb.wet.value = value;
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }

  set active(value: boolean) {
    this.config.active = value;
    if(this.config.active) {
      Tone.Destination.chain(this.reverb);
    } else {
      Tone.Destination.chain();
    }
  }

  get active(): boolean {
    return this.config.active;
  }
}
