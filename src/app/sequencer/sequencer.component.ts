import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import * as Tone from "tone";
import {InsAttackReleaseOptions, SynthService} from "../synth.service";
import {Subject, Subscription} from "rxjs";
import {v4 as uuidv4} from 'uuid';
import {PresetManagerService, InsPreset} from "../preset-manager/preset-manager.service";

export interface SequencerStep {
  id: number;
  velocity: number;
  pitch: number;
  duration: string;
  playing?: boolean;
  armed: boolean;
  gate?: number;
  octave?: number;
  note?: number;
}

export type SequencerConfig = {
  availableSteps: SequencerStep[];
  activeStepCount: number;
  interval: number;
  tempo: number;
  keyboardConnected: boolean;
  active: boolean;
}

@Component({
  selector: 'ins-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrl: './sequencer.component.scss'
})
export class SequencerComponent implements OnInit {
  noteOptions: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G','G#', 'A', 'A#', 'B'];
  rootNote: string = 'C3';
  currentStep: number = 0;
  playing: boolean = false;
  recordMode: boolean = false;
  currentRecordStep: number = 0;
  private loop: Tone.Loop | undefined;
  private subscriptions: Subscription = new Subscription();

  set active(value: boolean) {
    this.config.active = value;
  }
  get active(): boolean {
    return this.config.active;
  }

  set activeStepCount(value: number) {
    this.config.activeStepCount = value;
  }
  get activeStepCount(): number {
    return this.config.activeStepCount;
  }

  set availableSteps(value: SequencerStep[]) {
    this.config.availableSteps = value;
  }
  get availableSteps(): SequencerStep[] {
    return this.config.availableSteps;
  }

  set interval(value: number) {
    this.config.interval = value;
  }
  get interval(): number {
    return this.config.interval;
  }

  set tempo(value: number) {
    this.config.tempo = value;
  }
  get tempo(): number {
    return this.config.tempo;
  }

  set keyboardConnected(value: boolean) {
    this.config.keyboardConnected = value;
  }
  get keyboardConnected(): boolean {
    return this.config.keyboardConnected;
  }

  config: SequencerConfig = {
    availableSteps: [],
    activeStepCount: 8,
    interval: 2,
    tempo: 120,
    keyboardConnected: false,
    active: true
  }

  @Input() id: string = uuidv4();

  gateOptions: string[] = ['1n', '2n', '4n', '8n', '16n', '32n', '64n'];

  stepPlaying: Subject<number> = new Subject<number>();

  constructor(private changeDetectorRef: ChangeDetectorRef, private presetManagerService: PresetManagerService, private synthService: SynthService) {
    for(let i: number = 0; i < 16; i++) {
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

  setKeyboardConnection(): void {
    this.synthService.toggleSequencerKeyboardConnected();
    if(this.keyboardConnected) {
      this.subscriptions = new Subscription();
      this.subscriptions.add(this.synthService.keyDownEvent.subscribe((event: any): void => {
        this.rootNote = event;
        if(!this.playing) this.playSequence();
        console.log('keyDownEvent', event);
      }));
      this.subscriptions.add(this.synthService.keyUpEvent.subscribe((event: any): void => {
        this.rootNote = 'C';
        this.stopSequence();
        console.log('keyUpEvent', event);
      }));
    } else {
      this.subscriptions.unsubscribe();
    }
  }

  toggleRecordMode(): void {
    this.recordMode = !this.recordMode;
    if(this.recordMode) {
      this.currentRecordStep = 0;
      this.subscriptions = new Subscription();
      this.subscriptions.add(this.synthService.keyDownEvent.subscribe((event: any): void => {
        console.log('keyDownEvent', event);
      }));
      this.subscriptions.add(this.synthService.keyUpEvent.subscribe((event: any): void => {
        console.log('keyUpEvent', event);
        this.availableSteps[this.currentRecordStep].pitch = this.noteOptions.indexOf(event.substring(0, event.length - 1));
        //this.availableSteps[this.currentRecordStep].octave = event.substring(-1);
        //console.log('this.availableSteps[this.currentRecordStep].pitch', this.availableSteps[this.currentRecordStep].pitch);
        this.currentRecordStep = (this.currentRecordStep + 1) % this.activeStepCount;
      }));
    }  else {
      this.subscriptions.unsubscribe();
    }
    this.changeDetectorRef.detectChanges();
  }

  playSequence(): void {
    this.playing = true;
    let index: number = 0;
    this.loop = new Tone.Loop((time: number): void => {
      const step: SequencerStep = this.availableSteps[index];
      if(step.armed) {
        const tone: Tone.FrequencyClass<number> = Tone.Frequency(this.rootNote).transpose((step.pitch || 0) + ((step.octave || 0) * 12));
        const attackReleaseOptions: InsAttackReleaseOptions = {
          note: tone.toNote(),
          duration: this.gateOptions[step.gate || 0],
          velocity: step.velocity,
          time: time
        }
        this.synthService.attackRelease(attackReleaseOptions);
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

  stopSequence(): void {
    this.playing = false;
    this.loop?.stop();
    Tone.Transport.stop();
    Tone.Transport.loopStart = 0;
    this.currentStep = 0;
    this.changeDetectorRef.detectChanges();
  }
}
