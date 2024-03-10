import { Component } from '@angular/core';
import * as Tone from "tone";
import {InsAttackReleasePayload, SynthService} from "../synth.service";

export interface PianoRollStep {
  id: string;
  velocity: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
  gate?: number;
  note: string;
}

@Component({
  selector: 'ins-piano-roll',
  templateUrl: './piano-roll.component.html',
  styleUrl: './piano-roll.component.scss'
})
export class PianoRollComponent {

  public tempo: number = 120;
  public interval: number = 0;
  public playing: boolean = false;
  public currentStep: number = 0;
  public loop: Tone.Loop | undefined;
  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [1,2,3];
  public availableSteps : {[key: string]: PianoRollStep[]} = {};
  public stepCount: number = 16;

  constructor(public synthService: SynthService) {
    this.buildSteps();
  }

  buildSteps(): void {
    for(let i = 0; i < this.octaves.length; i++) {
      for(let j = 0; j < this.notes.length; j++) {
        let stepArray = [];
        for(let k = 0; k < this.stepCount; k++) {
          stepArray.push({
            id: 'step' + i + '_' + j + '_' + k,
            velocity: .01,
            duration: '4n',
            playing: false,
            armed: false,
            gate: 0,
            note: this.notes[j] + this.octaves[i]
          });
        }
        this.availableSteps['row_' + i + '_' + j] = stepArray;
      }
    }
    console.log(this.availableSteps);
  }

  toggleStep(step: PianoRollStep): void {
    step.armed = !step.armed;
  }

  play(): void {
    this.playing = true;
    let index: number = 0;
    this.loop = new Tone.Loop((time: number): void => {
      let notes: string[] = [];
      for (let availableStepsKey in this.availableSteps) {
        if (this.availableSteps.hasOwnProperty(availableStepsKey)) {
          const step: PianoRollStep[] = this.availableSteps[availableStepsKey];
          if (step[index].armed) {
            notes.push(step[index].note);
          }
        }
      }
      if(notes.length > 0) {
        this.synthService.attackRelease({note: notes, duration: "4n", velocity: .8, time: time});
        console.log(notes);
      }
      index = (index + 1) % this.stepCount;
    }, "4n").start(0);
    Tone.Transport.bpm.value = this.tempo;
    Tone.Transport.start();
  }

  stop(): void {
    this.playing = false;
    this.loop?.stop();
    Tone.Transport.stop();
  }

  pause(): void {
    this.playing = false;
    this.loop?.stop();
    Tone.Transport.pause();
  }

}
