import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";

export type TremoloConfig = {
  active: boolean;
  depth: number;
  frequency: number;
  spread: number;
  type: string;
  wet: number;
}

@Component({
  selector: 'ins-tremolo',
  templateUrl: './tremolo.component.html',
  styleUrl: './tremolo.component.scss'
})
export class TremoloComponent extends AbstractSynthComponent<TremoloConfig> {

  public override config: TremoloConfig = {
    active: false,
    wet: 1,
    frequency: 3,
    type: 'sine',
    depth: 0.8,
    spread: 0
  }
  protected override instrument: Tone.Tremolo = new Tone.Tremolo(5, 0.5);
  protected override componentType: string = 'effect';


  set active(value: boolean) {
    console.log(this.config.active, value);
    this.config.active = value;
    if(this.config.active) {
      this.synthService.addEffect(this.id, this.instrument, this.config);
      this.instrument.start();
    } else {
      this.instrument.stop();
      this.synthService.removeEffect(this.id);
    }
  }

  get active(): boolean {
    return this.config.active;
  }

  set depth(value: number) {
    this.instrument.set({depth: value});
    this.config.depth = value;
  }

  get depth(): number {
    return this.config.depth;
  }

  set frequency(value: number) {
    this.instrument.set({frequency: value});
    this.config.frequency = value;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  set spread(value: number) {
    this.instrument.set({spread: value});
    this.config.spread = value;
  }

  get spread(): number {
    return this.config.spread;
  }

  set type(value: any) {
    this.instrument.set({type: value});
    this.config.type = value;
  }

  get type(): any {
    return this.config.type;
  }

  set wet(value: number) {
    this.instrument.wet.value = value;
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }
}