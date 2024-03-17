import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import * as Tone from "tone";
import {SynthService} from "../synth.service";
import {Subject} from "rxjs";
import {v4 as uuidv4} from "uuid";
import {InsPreset, PresetManagerService} from "../preset-manager/preset-manager.service";

export type PianoRollStep = {
  id: string;
  velocity: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
  gate?: number;
  note: string;
}

export type PianoRollConfig = {
  availableSteps: {[key: string]: PianoRollStep[]};
  stepCount: number;
  activeStepCount: number;
  interval: number;
  tempo: number;
}

@Component({
  selector: 'ins-piano-roll',
  templateUrl: './piano-roll.component.html',
  styleUrl: './piano-roll.component.scss'
})
export class PianoRollComponent implements OnInit {

  private config: PianoRollConfig = {
    availableSteps: {},
    stepCount: 16,
    activeStepCount: 8,
    interval: 2,
    tempo: 120,
  }

  @Input() id: string = uuidv4();

  public playing: boolean = false;
  public paused: boolean = false;
  public currentStep: number = 0;
  public loop: Tone.Loop | undefined;
  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [1,2,3];
  public gateOptions: string[] = ['1n', '2n', '4n', '8n', '16n', '32n', '64n'];

  stepPlaying: Subject<number> = new Subject<number>();

  set availableSteps(value: {[key: string]: PianoRollStep[]}) {
    this.config.availableSteps = value;
  }

  get availableSteps(): {[key: string]: PianoRollStep[]} {
    return this.config.availableSteps;
  }

  set stepCount(value: number) {
    this.config.stepCount = value;
  }

  get stepCount(): number {
    return this.config.stepCount;
  }

  set activeStepCount(value: number) {
    this.config.activeStepCount = value;
  }

  get activeStepCount(): number {
    return this.config.activeStepCount;
  }

  set tempo(value: number) {
    this.config.tempo = value;
  }

  get tempo(): number {
    return this.config.tempo;
  }

  set interval(value: number) {
    this.config.interval = value;
  }
  get interval(): number {
    return this.config.interval;
  }

  constructor(public synthService: SynthService, public changeDetectorRef: ChangeDetectorRef, private presetManagerService: PresetManagerService) {
    this.buildSteps();
  }

  ngOnInit(): void {
    this.presetManagerService.loadConfigEvent.subscribe((preset: InsPreset): void => {
      if(preset.components[this.id]) {
        this.config = preset.components[this.id];
      }
    });
    this.presetManagerService.saveConfigEvent.subscribe((presetId: string): void => {
      const preset: string | null = localStorage.getItem(presetId);
      if(preset) {
        let presetConfig = JSON.parse(preset);
        presetConfig.components[this.id] = this.config;
        localStorage.setItem(presetId, JSON.stringify(presetConfig));
      }
    });
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
        index = (index + 1) % this.activeStepCount;
        this.changeDetectorRef.detectChanges();
      }, time);

    }, this.gateOptions[this.interval]).start(0);
    Tone.Transport.bpm.value = this.tempo;
    Tone.Transport.start();
  }

  stop(): void {
    this.currentStep = 0;
    this.playing = false;
    this.paused = false;
    this.loop?.stop();
    Tone.Transport.stop();
    this.changeDetectorRef.detectChanges();
  }

  pause(): void {
    this.playing = false;
    this.paused = true;
    this.loop?.stop();
    Tone.Transport.stop();
    this.changeDetectorRef.detectChanges();
  }

}
