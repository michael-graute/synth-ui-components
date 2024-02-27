import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';

export type VibratoConfig = {
  active: boolean;
  depth: number;
  frequency: number;
  type: string;
  wet: number;
};

@Component({
  selector: 'ins-vibrato',
  templateUrl: './vibrato.component.html',
  styleUrl: './vibrato.component.scss'
})
export class VibratoComponent extends AbstractSynthComponent<VibratoConfig> {

  protected override instrument: Tone.Vibrato = new Tone.Vibrato();
  protected override componentType = 'effect';
  public override config: VibratoConfig = {
    active: true,
    depth: 0.1,
    frequency: 5,
    type: 'sine',
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

  set depth(depth: number) {
    this.instrument.set({depth: depth});
    this.config.depth = depth;
  }

  get depth(): number {
    return this.config.depth;
  }

  set frequency(frequency: number) {
    this.instrument.set({frequency: frequency});
    this.config.frequency = frequency;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  set type(type: any) {
    this.instrument.set({type: type});
    this.config.type = type;
  }

  get type(): any {
    return this.config.type;
  }

  set wet(wet: number) {
    this.instrument.set({wet: wet});
    this.config.wet = wet;
  }

  get wet(): number {
    return this.config.wet;
  }

}
