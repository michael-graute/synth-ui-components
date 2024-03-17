import {ChangeDetectorRef, Component} from '@angular/core';
import * as Tone from "tone";
import {SynthService} from "../synth.service";
import {Subject} from "rxjs";

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
  public interval: any = "4n";
  public playing: boolean = false;
  public paused: boolean = false;
  public currentStep: number = 0;
  public loop: Tone.Loop | undefined;
  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [1,2,3];
  public availableSteps : {[key: string]: PianoRollStep[]} = {};
  public stepCount: number = 16;

  stepPlaying: Subject<number> = new Subject<number>();

  constructor(public synthService: SynthService, public changeDetectorRef: ChangeDetectorRef) {
    this.buildSteps();
  }

  buildSteps(): void {
    for(let i = 0; i < this.octaves.length; i++) {
      for(let j = 0; j < this.notes.length; j++) {
        let stepArray = [];
        for(let k = 0; k < this.stepCount; k++) {
          stepArray.push({
            id: 'step' + i + '_' + j + '_' + k,
            velocity: .7,
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
  }

  toggleStep(step: PianoRollStep): void {
    step.armed = !step.armed;
  }

  play(): void {
    this.playing = true;
    this.paused = false;
    let index = this.currentStep;
    this.loop = new Tone.Loop((time: number): void => {
      console.log(index);
      for (let availableStepsKey in this.availableSteps) {
        if (this.availableSteps.hasOwnProperty(availableStepsKey)) {
          const step: PianoRollStep = this.availableSteps[availableStepsKey][index];
          if (step.armed) {
            this.synthService.attackRelease({note: step.note, duration: step.duration, velocity: step.velocity, time: time});
          }
        }
      }
      Tone.Draw.schedule((): void => {
        this.currentStep = index;
        this.stepPlaying.next(index);
        console.log(this.currentStep);
        index = (index + 1) % this.stepCount;
        this.changeDetectorRef.detectChanges();
      }, time);

    }, this.interval).start(0);
    Tone.Transport.bpm.value = this.tempo;
    Tone.Transport.start();
  }

  stop(): void {
    this.currentStep = 0;
    this.playing = false;
    this.paused = false;
    this.loop?.stop();
    Tone.Transport.stop();
  }

  pause(): void {
    this.playing = false;
    this.paused = true;
    this.loop?.stop();
    Tone.Transport.pause();
  }

}
