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
    this.instruments.forEach((instrument: InsInstrument) => {
      if(instrument.config.active) {
        const transposedNote: Tone.Unit.Note = Tone.Frequency(note).transpose((instrument.config.octave || 0) * 12).toNote();
        if(instrument.config.triggerWithoutNote) {
          // @ts-ignore
          instrument.instrument.triggerAttack(undefined, velocity);
        } else {
          instrument.instrument.triggerAttack(transposedNote, undefined, velocity);
        }
      }
    });
  }

  noteOff(note: string): void {
    this.noteOffEvent.next(note);
    this.instruments.forEach((instrument: InsInstrument) => {
      if (instrument.config.active) {
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
        if(instrument.config.triggerWithoutNote) {
          //@ts-ignore
          instrument.instrument.triggerAttackRelease(options.duration, options.time, options.velocity);
        } else {
          if(Array.isArray(options.note)) {
            if(options.note.length > 0) {
              let notes: Tone.Unit.Note[] = [];
              options.note.forEach((note: string) => {
                const transposedNote: Tone.Unit.Note = Tone.Frequency(note).transpose((instrument.config.octave || 0) * 12).toNote();
                notes.push(transposedNote);
              });
              if(instrument.instrument.name === 'PolySynth') {
                //@ts-ignore
                instrument.instrument.triggerAttackRelease(notes, options.duration, options.time, options.velocity);
              } else {
                instrument.instrument.triggerAttackRelease(notes[0], options.duration, options.time, options.velocity);
              }
            }
          } else {
            const transposedNote: Tone.Unit.Note = Tone.Frequency(options.note).transpose((instrument.config.octave || 0) * 12).toNote();
            instrument.instrument.triggerAttackRelease(transposedNote, options.duration, options.time, options.velocity);
          }

        }
      }
    });
  }

  addEffect(id: string, effect: any, config: any): void {
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
    return <InsEffect>this.getEffects().find((effect: InsEffect) => effect.id === id);
  }

  getEffects(): InsEffect[] {
    return this.effects;
  }

  addInstrument(id: string, instrument: Instrument<any>, config: any): void {
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

  replaceInstrument(id: string, instrument: Instrument<any>, config: any): void {
    this.removeInstrument(id);
    this.addInstrument(id, instrument, config);
  }

  getInstrument(id: string): InsInstrument {
    return <InsInstrument>this.getInstruments().find((instrument: InsInstrument) => instrument.id === id);
  }

  getInstruments(): InsInstrument[] {
    return this.instruments;
  }

  addLFO(id: string, lfo: LFO, config: any): void {
    this.lfos.push({id: id, lfo: lfo, config});
    if(config.active) lfo.start();
  }

  removeLFO(id: string): void {
    const lfoIndex: number = this.lfos.findIndex((lfo: InsLFO) => lfo.id === id);
    if(lfoIndex >= 0) {
      const lfo: LFO = this.lfos[lfoIndex].lfo;
      lfo.disconnect();
      this.lfos.splice(lfoIndex, 1);
    }
  }

  connectLFO(id: string, destination: any): void {
    const lfo: LFO = this.getLFO(id).lfo;
    lfo.connect(destination);
  }

  disconnectLFO(id: string, destination: any): void {
    const lfo: LFO = this.getLFO(id).lfo;
    lfo.disconnect(destination);
  }

  getLFOs(): InsLFO[] {
    return this.lfos;
  }

  getLFO(id: string): InsLFO {
    return <InsLFO>this.getLFOs().find((lfo: InsLFO) => lfo.id === id);
  }

  startLFO(id: string): void {
    const lfo: LFO = this.getLFO(id)?.lfo;
    if(lfo) lfo.start();
  }

  stopLFO(id: string): void {
    const lfo: LFO = this.getLFO(id)?.lfo;
    if(lfo) lfo.stop();
  }
}
