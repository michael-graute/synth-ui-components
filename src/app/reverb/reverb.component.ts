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

  override instrument: Tone.Reverb = new Tone.Reverb({decay: 2.5, wet: 0.8});
  override componentType: string = 'effect';

  public override config: ReverbConfig = {
    active: true,
    decay: 2.5,
    wet: 0.8
  }

  set decay(value: number) {
    this.instrument.decay = value;
    this.config.decay = value;
  }

  get decay(): number {
    return this.config.decay;

  }

  set wet(value: number) {
    this.instrument.wet.value = value;
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }

  set active(value: boolean) {
    this.config.active = value;
    if(this.config.active) {
      this.synthService.addEffect(this.id, this.instrument, this.config)
    } else {
      this.synthService.removeEffect(this.id);
    }
  }

  get active(): boolean {
    return this.config.active;
  }
}
