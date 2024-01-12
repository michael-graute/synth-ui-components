import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Tone} from "tone/build/esm/core/Tone";
import {OmniOscillator, Synth} from "tone";

export interface InsOscillator {
  id: string;
  oscillator: Synth;
}

@Injectable({
  providedIn: 'root'
})
export class SynthService {

  oscillators: InsOscillator[] = [];

  noteOnEvent: Subject<string> = new Subject<string>();
  noteOffEvent: Subject<string> = new Subject<string>();

  constructor() { }

  noteOn(note: string) {
    this.noteOnEvent.next(note);
  }

  noteOff(note: string) {
    this.noteOffEvent.next(note);
  }

  addOscillator(oscillator: InsOscillator) {
    oscillator.oscillator.toDestination();
    this.oscillators.push(oscillator);
  }

  getOscillator(id: string): Synth | undefined {
    return this.oscillators.find(o => o.id === id)?.oscillator;
  }
}
