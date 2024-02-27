import { Component } from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";

export type DelayConfig = {
  active: boolean;
  time: number;
  feedback: number;
  wet: number;
  maxDelay: number;
}

@Component({
  selector: 'ins-delay',
  templateUrl: './feedback-delay.component.html',
  styleUrl: './feedback-delay.component.scss'
})
export class FeedbackDelayComponent extends AbstractSynthComponent<DelayConfig> {

  override instrument: Tone.FeedbackDelay = new Tone.FeedbackDelay(.5, .5);
  override componentType: string = 'effect';

  public override config: DelayConfig = {
    active: true,
    time: .5,
    feedback: .5,
    wet: .5,
    maxDelay: 5
  }

  set time(value: number) {
    this.instrument.delayTime.value = value;
    this.config.time = value;
  }

  get time(): number {
    return this.config.time;
  }

  set feedback(value: number) {
    this.instrument.feedback.value = value;
    this.config.feedback = value;
  }

  get feedback(): number {
    return this.config.feedback;
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

  set maxDelay(value: number) {
    this.instrument.set({maxDelay: value});
    this.config.maxDelay = value;
  }

  get maxDelay(): number {
    return this.config.maxDelay;
  }
}
