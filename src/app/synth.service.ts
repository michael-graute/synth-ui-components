import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import * as Tone from "tone";

export interface InsOscillator {
  id: string;
  oscillator: Tone.Synth;
}

export interface InsAttackReleaseOptions {
  note: any,
  duration: any,
  time?: any,
  velocity?: any
}

@Injectable({
  providedIn: 'root'
})
export class SynthService {

  oscillators: InsOscillator[] = [];

  noteOnEvent: Subject<string> = new Subject<string>();
  noteOffEvent: Subject<string> = new Subject<string>();
  keyDownEvent: Subject<string> = new Subject<string>();
  keyUpEvent: Subject<string> = new Subject<string>();
  attackReleaseEvent: Subject<InsAttackReleaseOptions> = new Subject<InsAttackReleaseOptions>();
  sequencerKeyboardConnected: boolean = false;

  constructor() { }

  toggleSequencerKeyboardConnected() {
    this.sequencerKeyboardConnected = !this.sequencerKeyboardConnected;
  }

  noteOn(note: string) {
    this.noteOnEvent.next(note);
  }

  noteOff(note: string) {
    this.noteOffEvent.next(note);
  }

  keyDown(note: string) {
    if(!this.sequencerKeyboardConnected) this.noteOn(note);
    this.keyDownEvent.next(note);
  }

  keyUp(note: string) {
    if(!this.sequencerKeyboardConnected) this.noteOff(note);
    this.keyUpEvent.next(note);
  }

  attackRelease(options: InsAttackReleaseOptions) {
    this.attackReleaseEvent.next(options);
  }
}
