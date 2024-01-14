import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Tone} from "tone/build/esm/core/Tone";
import {OmniOscillator, Synth} from "tone";

export interface InsOscillator {
  id: string;
  oscillator: Synth;
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
  attackReleaseEvent: Subject<InsAttackReleaseOptions> = new Subject<InsAttackReleaseOptions>();

  constructor() { }

  noteOn(note: string) {
    this.noteOnEvent.next(note);
  }

  noteOff(note: string) {
    this.noteOffEvent.next(note);
  }

  keyDown(note: string) {
    this.noteOn(note);
  }

  keyUp(note: string) {
    this.noteOff(note);
  }

  attackRelease(options: InsAttackReleaseOptions) {
    //const eventPayload: InsAttackReleaseOptions = {note: note, duration: duration, time: time, velocity: velocity};
    this.attackReleaseEvent.next(options);
  }

  addOscillator(oscillator: InsOscillator) {
    oscillator.oscillator.toDestination();
    this.oscillators.push(oscillator);
  }

  getOscillator(id: string): Synth | undefined {
    return this.oscillators.find(o => o.id === id)?.oscillator;
  }
}
