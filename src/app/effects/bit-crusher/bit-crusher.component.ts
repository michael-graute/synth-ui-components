import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';

export type BitCrusherConfig = {
  active: boolean;
  bits: number;
  wet: number;
};

@Component({
  selector: 'ins-bit-crusher',
  templateUrl: './bit-crusher.component.html',
  styleUrl: './bit-crusher.component.scss'
})
export class BitCrusherComponent extends AbstractSynthComponent<BitCrusherConfig> {

  protected override instrument: Tone.BitCrusher = new Tone.BitCrusher();
  protected override componentType = 'effect';
  public override config: BitCrusherConfig = {
    active: false,
    bits: 4,
    wet: 1,
  };

  set bits(bits: number) {
    this.instrument.set({bits: bits});
    this.config.bits = bits;
  }

  get bits(): number {
    return this.config.bits;
  }

  set wet(wet: number) {
    this.instrument.set({wet: wet});
    this.config.wet = wet;
  }

  get wet(): number {
    return this.config.wet;
  }

}
