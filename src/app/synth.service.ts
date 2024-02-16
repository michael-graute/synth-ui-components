import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import * as Tone from "tone";
import {Instrument} from "tone/build/esm/instrument/Instrument";
import {LFO} from "tone";

export type InsAttackReleasePayload = {
  note: any,
  duration: any,
  time?: any,
  velocity?: any
}

export type InsEffect = {
  id: string;
  effect: any;
  config: any;
}

export type InsInstrument = {
  id: string;
  instrument: Instrument<any>;
  config: any;
}

export type InsLFO = {
  id: string;
  lfo: LFO;
  config: any;
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
  instruments: InsInstrument[] = [];
  lfos: InsLFO[] = [];

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

  noteOff(note: string): void {
    this.noteOffEvent.next(note);
  }

  keyDown(note: string, velocity: number = 1): void {
    if(!this.sequencerKeyboardConnected && !this.keyboardDisabled) this.noteOn(note, velocity);
    this.keyDownEvent.next(note);
  }

  keyUp(note: string) {
    if(!this.sequencerKeyboardConnected && !this.keyboardDisabled) this.noteOff(note);
    this.keyUpEvent.next(note);
  }

  attackRelease(options: InsAttackReleasePayload): void {
    this.attackReleaseEvent.next(options);
  }

  addEffect(effect: InsEffect): void {
    this.effects.push(effect);
    const tmpEffects: any[] = [];
    this.effects.forEach((effect: InsEffect) => {
      tmpEffects.push(effect.effect);
    });
    Tone.Destination.chain(...tmpEffects);
  }

  removeEffect(effectId: string): void {
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

  getEffect(id: string): InsEffect {
    return <InsEffect>this.effects.find((effect: InsEffect) => effect.id === id);
  }

  addInstrument(id: string, instrument: Instrument<any>, config: any) {
    this.instruments.push({id: id, instrument: instrument, config});
  }

  removeInstrument(id: string): void {
    const instrumentIndex: number = this.instruments.findIndex((instrument: InsInstrument) => instrument.id === id);
    if(instrumentIndex >= 0) {
      this.instruments.splice(instrumentIndex, 1);
    }
  }

  getInstrument(id: string): InsInstrument {
    return <InsInstrument>this.instruments.find((instrument: InsInstrument) => instrument.id === id);
  }

  addLFO(id: string, lfo: LFO, config: any): void {
    this.lfos.push({id: id, lfo: lfo, config});
  }

  removeLFO(id: string): void {
    const lfoIndex: number = this.lfos.findIndex((lfo: InsLFO) => lfo.id === id);
    if(lfoIndex >= 0) {
      this.lfos.splice(lfoIndex, 1);
    }
  }

  getLFO(id: string): InsLFO {
    return <InsLFO>this.lfos.find((lfo: InsLFO) => lfo.id === id);
  }
}
