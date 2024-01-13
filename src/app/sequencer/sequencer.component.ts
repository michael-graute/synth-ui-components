import {ChangeDetectorRef, Component, Input} from '@angular/core';
import * as Tone from "tone";
import {SynthService} from "../synth.service";
import {Subject} from "rxjs";

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
  rootNote: string = 'C3';
  currentStep: number = 0;
  interval: string = '4n';
  tempo: number = 120;
  playing: boolean = false;
  private _active: boolean = true;
  private loop: Tone.Loop | undefined;
  @Input() service: SynthService | undefined;
  set active(value: boolean) {
    this._active = value;
    console.log('active', value)
  }
  get active(): boolean {
    return this._active;
  }

  stepPlaying: Subject<number> = new Subject<number>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {
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

  playSequence() {
    //this.sequenzerPlaying = true;
    //this.sequenzerStarted.next();
    this.playing = true;
    let index = 0;
    this.loop = new Tone.Loop(time => {
      const step: SequencerStep = this.availableSteps[index];
      if(step.armed) {
        const tone = Tone.Frequency(this.rootNote).transpose(step.pitch);
        this.service?.attackRelease(tone.toFrequency(), step.duration, time, step.velocity);
        /*this.synths.forEach((synth: Tone.Synth) => {
          synth.triggerAttackRelease(tone.toFrequency(), step.duration, time, step.velocity);
          this.noteOn.next(tone.toNote());
        });*/
      }
      Tone.Draw.schedule(() => {
        this.currentStep = index;
        this.stepPlaying.next(index);
        index = (index + 1) % this.activeStepCount;
        console.log('index', index);
        console.log('currentStep', this.currentStep);
        this.changeDetectorRef.detectChanges();
      }, time);
    }, this.interval).start(0);
    Tone.Transport.bpm.value = this.tempo;
    Tone.Transport.start();
    //this.lfo.start();
  }

  stopSequence() {
    //this.noteOff.next(this.currentNote);
    //this.sequenzerStopped.next();
    //this.sequenzerPlaying = false;
    this.playing = false;
    this.loop?.stop();
    Tone.Transport.stop();
    Tone.Transport.loopStart = 0;
    this.currentStep = 0;
    this.changeDetectorRef.detectChanges();
    //this.lfo.stop();*/
  }
}
