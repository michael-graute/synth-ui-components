import { Component } from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../abstracts/abstract-synth.component";

export type DelayConfig = {
  active: boolean;
  time: number;
  feedback: number;
  wet: number;
}

@Component({
  selector: 'ins-delay',
  templateUrl: './delay.component.html',
  styleUrl: './delay.component.scss'
})
export class DelayComponent extends AbstractSynthComponent<DelayConfig> {

  delay: Tone.FeedbackDelay = new Tone.FeedbackDelay(.5, .5);

  public override config: DelayConfig = {
    active: true,
    time: .5,
    feedback: .5,
    wet: .5
  }

  set time(value: number) {
    this.delay.delayTime.value = value;
    this.config.time = value;
  }

  get time(): number {
    return this.config.time;
  }

  set feedback(value: number) {
    this.delay.feedback.value = value;
    this.config.feedback = value;
  }

  get feedback(): number {
    return this.config.feedback;
  }

  set wet(value: number) {
    this.delay.wet.value = value;
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }

  set active(value: boolean) {
    this.config.active = value;
    if(this.config.active) {
      this.synthService.addEffect({id: this.id, effect: this.delay, config: this.config})
    } else {
      this.synthService.removeEffect(this.id);
    }
  }

  get active(): boolean {
    return this.config.active;
  }
}
