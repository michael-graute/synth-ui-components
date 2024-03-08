import { Component } from '@angular/core';

export interface PianoRollStep {
  id: string;
  velocity: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
  gate?: number;
  note?: string;
}

@Component({
  selector: 'ins-piano-roll',
  templateUrl: './piano-roll.component.html',
  styleUrl: './piano-roll.component.scss'
})
export class PianoRollComponent {

  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [1,2,3,4,5,6];
  public steps : {[key: string]: PianoRollStep[]} = {};

  constructor() {
    this.buildSteps();
  }

  buildSteps(): void {
    for(let i = 0; i < this.octaves.length; i++) {
      for(let j = 0; j < this.notes.length; j++) {
        let stepArray = [];
        for(let k = 0; k < 16; k++) {
          stepArray.push({
            id: 'step' + i + '_' + j + '_' + k,
            velocity: 100,
            duration: '4n',
            playing: false,
            armed: true,
            gate: 0,
            note: this.notes[j] + this.octaves[i]
          });
        }
        this.steps['row_' + i + '_' + j] = stepArray;
      }
    }
    console.log(this.steps);
  }

  toggleStep(step: PianoRollStep): void {
    step.armed = !step.armed;
  }


}
