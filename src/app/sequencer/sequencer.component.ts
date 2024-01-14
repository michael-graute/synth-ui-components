import {ChangeDetectorRef, Component, Input} from '@angular/core';
import * as Tone from "tone";
import {InsAttackReleaseOptions, SynthService} from "../synth.service";
import {Subject} from "rxjs";

export interface SequencerStep {
  id: number;
  velocity: number;
  pitch: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
  gate?: number;
  octave?: number;
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
  interval: number = 2;
  tempo: number = 120;
  playing: boolean = false;
  private _active: boolean = true;
  private loop: Tone.Loop | undefined;
  @Input() service: SynthService | undefined;
  set active(value: boolean) {
    this._active = value;
  }
  get active(): boolean {
    return this._active;
  }

  gateOptions: string[] = ['1n', '2n', '4n', '8n', '16n', '32n', '64n'];

  stepPlaying: Subject<number> = new Subject<number>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    for(let i = 0; i < 16; i++) {
      const armed: boolean = i < 8;
      this.availableSteps.push({
        id: i,
        velocity: 1,
        pitch: 0,
        duration: '8n',
        armed: armed,
        octave: 0,
        gate: 3
      });
    }
  }

  playSequence() {
    this.playing = true;
    let index = 0;
    this.loop = new Tone.Loop(time => {
      const step: SequencerStep = this.availableSteps[index];
      if(step.armed) {
        const tone = Tone.Frequency(this.rootNote).transpose(step.pitch + ((step.octave || 0) * 12));
        const attackReleaseOptions: InsAttackReleaseOptions = {
          note: tone.toNote(),
          duration: this.gateOptions[step.gate || 0],
          velocity: step.velocity,
          time: time
        }
        this.service?.attackRelease(attackReleaseOptions);
      }
      Tone.Draw.schedule(() => {
        this.currentStep = index;
        this.stepPlaying.next(index);
        index = (index + 1) % this.activeStepCount;
        this.changeDetectorRef.detectChanges();
      }, time);
    }, this.gateOptions[this.interval]).start(0);
    Tone.Transport.bpm.value = this.tempo;
    Tone.Transport.start();
  }

  stopSequence() {
    this.playing = false;
    this.loop?.stop();
    Tone.Transport.stop();
    Tone.Transport.loopStart = 0;
    this.service?.noteOff('C3');
    this.currentStep = 0;
    this.changeDetectorRef.detectChanges();
  }
}
