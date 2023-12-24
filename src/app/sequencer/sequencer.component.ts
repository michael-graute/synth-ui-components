import { Component } from '@angular/core';

export interface SequencerStep {
  id: number;
  velocity: number;
  pitch: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
}

@Component({
  selector: 'ins-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrl: './sequencer.component.scss'
})
export class SequencerComponent {
  availableSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
}
