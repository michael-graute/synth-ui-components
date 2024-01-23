import { Component } from '@angular/core';
import * as Tone from "tone";

@Component({
  selector: 'ins-reverb',
  templateUrl: './reverb.component.html',
  styleUrl: './reverb.component.scss'
})
export class ReverbComponent {

  private _active: boolean = false;
  reverb: Tone.Reverb = new Tone.Reverb(1);

  set reverbDecay(value: number) {
    this.reverb.decay = value;
  }

  get reverbDecay(): number {
    return this.reverb.decay as number;
  }

  set reverbWet(value: number) {
    this.reverb.wet.value = value;
  }

  get reverbWet(): number {
    return this.reverb.wet.value as number;
  }

  set active(value: boolean) {
    this._active = value;
    if(this._active) {
      Tone.Destination.chain(this.reverb);
    } else {
      Tone.Destination.chain();
    }
  }

  get active(): boolean {
    return this._active;
  }
}
