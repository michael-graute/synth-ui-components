import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';

export type DistortionConfig = {
  active: boolean;
  distortion: number;
  oversample: number;
  wet: number;
};

@Component({
  selector: 'ins-distortion',
  templateUrl: './distortion.component.html',
  styleUrl: './distortion.component.scss'
})
export class DistortionComponent extends AbstractSynthComponent<DistortionConfig> {

  protected override instrument: Tone.Distortion = new Tone.Distortion();
  protected override componentType = 'effect';

  public override config: DistortionConfig = {
    active: true,
    distortion: .4,
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

  set distortion(distortion: number) {
    this.instrument.set({distortion: distortion});
    this.config.distortion = distortion;
  }

  get distortion(): number {
    return this.config.distortion;
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
