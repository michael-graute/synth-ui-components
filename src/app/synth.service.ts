import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import * as Tone from "tone";

export interface InsAttackReleasePayload {
  note: any,
  duration: any,
  time?: any,
  velocity?: any
}

export interface InsEffect {
  id: string;
  effect: any;
}

export type InsNoteOnPayload = {
  note: string;
  velocity: number;
}

@Injectable({
  providedIn: 'root'
})
export class SynthService {

  effects: InsEffect[] = [];

  keyboardDisabled: boolean = false;

  noteOnEvent: Subject<InsNoteOnPayload> = new Subject<InsNoteOnPayload>();
  noteOffEvent: Subject<string> = new Subject<string>();
  keyDownEvent: Subject<string> = new Subject<string>();
  keyUpEvent: Subject<string> = new Subject<string>();
  attackReleaseEvent: Subject<InsAttackReleasePayload> = new Subject<InsAttackReleasePayload>();
  sequencerKeyboardConnected: boolean = false;

  constructor() { }

  toggleSequencerKeyboardConnected() {
    this.sequencerKeyboardConnected = !this.sequencerKeyboardConnected;
  }

  noteOn(note: string, velocity: number = 1): void {
    this.noteOnEvent.next({note: note, velocity: velocity});
  }

  noteOff(note: string) {
    this.noteOffEvent.next(note);
  }

  keyDown(note: string, velocity: number = 1) {
    if(!this.sequencerKeyboardConnected && !this.keyboardDisabled) this.noteOn(note, velocity);
    this.keyDownEvent.next(note);
  }

  keyUp(note: string) {
    if(!this.sequencerKeyboardConnected && !this.keyboardDisabled) this.noteOff(note);
    this.keyUpEvent.next(note);
  }

  attackRelease(options: InsAttackReleasePayload) {
    this.attackReleaseEvent.next(options);
  }

  addEffect(effect: InsEffect) {
    this.effects.push(effect);
    const tmpEffects: any[] = [];
    this.effects.forEach((effect: InsEffect) => {
      tmpEffects.push(effect.effect);
    });
    Tone.Destination.chain(...tmpEffects);
  }

  removeEffect(effectId: string) {
    const effectIndex: number = this.effects.findIndex((effect: InsEffect) => effect.id === effectId);
    if(effectIndex >= 0) {
      this.effects.splice(effectIndex, 1);
      const tmpEffects: any[] = [];
      this.effects.forEach((effect: InsEffect) => {
        tmpEffects.push(effect.effect);
      });
      Tone.Destination.chain(...tmpEffects);
    }
  }
}
