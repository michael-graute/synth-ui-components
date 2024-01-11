import { Component } from '@angular/core';

export interface SequencerStep {
  id: number;
  velocity: number;
  pitch: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
  active: boolean;
}

@Component({
  selector: 'ins-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrl: './sequencer.component.scss'
})
export class SequencerComponent {
  availableSteps: SequencerStep[] = [];
  constructor() {
    for(let i = 0; i < 16; i++) {
      const active: boolean = i < 8;
      this.availableSteps.push({
        id: i,
        velocity: 0,
        pitch: 0,
        duration: '8n',
        armed: false,
        active: active
      });
    }
  }
}
