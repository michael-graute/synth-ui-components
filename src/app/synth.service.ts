import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import * as Tone from "tone";
import {Instrument} from "tone/build/esm/instrument/Instrument";
import {LFO} from "tone";
import {Effect} from "tone/build/esm/effect/Effect";

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
  masterChannel: Tone.Channel = new Tone.Channel().toDestination();

  constructor() { }

  toggleSequencerKeyboardConnected() {
    this.sequencerKeyboardConnected = !this.sequencerKeyboardConnected;
  }

  noteOn(note: string, velocity: number = 1): void {
    this.noteOnEvent.next({note: note, velocity: velocity});
    console.log('noteOn');
    this.instruments.forEach((instrument: InsInstrument) => {
      console.log(note);
      if(instrument.config.active) {
        const transposedNote: Tone.Unit.Note = Tone.Frequency(note).transpose((instrument.config.octave || 0) * 12).toNote();
        console.log(transposedNote);
        instrument.instrument.triggerAttack(transposedNote, undefined, velocity);
      }
    });
  }

  noteOff(note: string): void {
    this.noteOffEvent.next(note);
    console.log('noteOff');
    this.instruments.forEach((instrument: InsInstrument) => {
      console.log(note);
      if (instrument.config.active) {
        console.log(instrument.instrument.name);
        if(instrument.instrument.name === 'PolySynth') {
          const transposedNote: Tone.Unit.Note = Tone.Frequency(note).transpose((instrument.config.octave || 0) * 12).toNote();
          instrument.instrument.triggerRelease(transposedNote);
        } else {
          instrument.instrument.triggerRelease();
        }
      }
    });
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
    this.instruments.forEach((instrument: InsInstrument) => {
      if(instrument.config.active) {
        const transposedNote: Tone.Unit.Note = Tone.Frequency(options.note).transpose((instrument.config.octave || 0) * 12).toNote();
        instrument.instrument.triggerAttackRelease(transposedNote, options.duration, options.time, options.velocity);
      }
    });
  }

  addEffect(id: string, effect: Effect<any>, config: any): void {
    if(!this.getEffect(id)) {
      this.instruments.forEach((instrument: InsInstrument) => {
        instrument.instrument.connect(effect);
      });
      effect.chain(this.masterChannel);
      this.effects.push({id, effect, config});
    }
  }

  removeEffect(effectId: string): void {
    const effectIndex: number = this.effects.findIndex((effect: InsEffect) => effect.id === effectId);
    if(effectIndex >= 0) {
      const effect: Effect<any> = this.effects[effectIndex].effect;
      effect.disconnect();
      this.effects.splice(effectIndex, 1);
    }
  }

  getEffect(id: string): InsEffect {
    return <InsEffect>this.effects.find((effect: InsEffect) => effect.id === id);
  }

  addInstrument(id: string, instrument: Instrument<any>, config: any) {
    if(!this.getInstrument(id)) {
      instrument.connect(this.masterChannel);
      this.instruments.push({id: id, instrument: instrument, config});
    }
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
    console.log(lfo);
    this.lfos.push({id: id, lfo: lfo, config});
    lfo.connect(this.masterChannel.volume);
    if(config.active) lfo.start();
    //lfo.start();
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

  startLFO(id: string): void {
    const lfo: LFO = this.getLFO(id)?.lfo;
    if(lfo) {
      lfo.start();
      console.log(lfo.state);
    }
  }

  stopLFO(id: string): void {
    const lfo: LFO = this.getLFO(id).lfo;
    lfo.stop();
    console.log(lfo.state);
  }
}
