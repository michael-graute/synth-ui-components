import { Component } from '@angular/core';

export interface SequencerStep {
  id: number;
  velocity: number;
  pitch: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
  //active: boolean;
}

@Component({
  selector: 'ins-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrl: './sequencer.component.scss'
})
export class SequencerComponent {
  availableSteps: SequencerStep[] = [];
  activeStepCount: number = 8;
  private _active: boolean = true;
  set active(value: boolean) {
    this._active = value;
    console.log('active', value)
  }
  get active(): boolean {
    return this._active;
  }
  constructor() {
    for(let i = 0; i < 16; i++) {
      const armed: boolean = i < 8;
      this.availableSteps.push({
        id: i,
        velocity: 0,
        pitch: 0,
        duration: '8n',
        armed: armed,
        //active: active
      });
    }
  }
}
