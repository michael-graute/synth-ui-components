import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';

export type ChebyshevConfig = {
  active: boolean;
  order: number;
  oversample: number;
  wet: number;
};

@Component({
  selector: 'ins-chebyshev',
  templateUrl: './chebyshev.component.html',
  styleUrl: './chebyshev.component.scss'
})
export class ChebyshevComponent extends AbstractSynthComponent<ChebyshevConfig> {

  protected override instrument: Tone.Chebyshev = new Tone.Chebyshev();
  protected override componentType = 'effect';
  public override config: ChebyshevConfig = {
    active: true,
    order: 1,
    oversample: 0,
    wet: 1,
  };

  public oversampleOptions = ['none', '2x', '4x'];

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

  set order(order: number) {
    this.instrument.set({order: order});
    this.config.order = order;
  }

  get order(): number {
    return this.config.order;
  }

  set oversample(oversample: number) {
    this.instrument.set({oversample: this.oversampleOptions[oversample] as any});
    this.config.oversample = oversample;
  }

  get oversample(): number {
    return this.config.oversample;
  }

  set wet(wet: number) {
    this.instrument.set({wet: wet});
    this.config.wet = wet;
  }

  get wet(): number {
    return this.config.wet;
  }

}
