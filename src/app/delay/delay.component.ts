import { Component } from '@angular/core';
import * as Tone from "tone";

@Component({
  selector: 'ins-delay',
  templateUrl: './delay.component.html',
  styleUrl: './delay.component.scss'
})
export class DelayComponent {

  private _active: boolean = false;
  delay: Tone.FeedbackDelay = new Tone.FeedbackDelay(.5, .5);

  constructor() {
    this.delay.wet.value = 0.5;
  }

  set delayTime(value: number) {
    this.delay.delayTime.value = value;
  }

  get delayTime(): number {
    return this.delay.delayTime.value as number;
  }

  set delayFeedback(value: number) {
    this.delay.feedback.value = value;
  }

  get delayFeedback(): number {
    return this.delay.feedback.value as number;
  }

  set delayWet(value: number) {
    this.delay.wet.value = value;
  }

  get delayWet(): number {
    return this.delay.wet.value as number;
  }

  set active(value: boolean) {
    this._active = value;
    if(this._active) {
      Tone.Destination.chain(this.delay);
    } else {
      Tone.Destination.chain();
    }
    console.log((this.delay.get().delayTime as number) );
  }

  get active(): boolean {
    return this._active;
  }
}
