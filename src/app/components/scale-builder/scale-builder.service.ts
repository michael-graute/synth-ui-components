import { Injectable } from '@angular/core';
import {getRandomInt} from "../../utils";

@Injectable({
  providedIn: 'root'
})
export class ScaleBuilderService {

  private notes: string[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  private formulas: any = {
    'chromatic': [1,1,1,1,1,1,1,1,1,1,1],
    'major': [2,2,1,2,2,2],
    'natural-minor': [2,1,2,2,1,2],
    'harmonic-minor': [2,1,2,2,1,3],
    'melodic-minor': [2,1,2,2,2,2],
    'dorian-mode': [2,1,2,2,2,1],
    'mixolydian-mode': [2,2,1,2,2,1],
    'modern-lydian-mode': [2,2,2,1,2,2],
    'major-pentatonic': [1,2,3,5,6],
    'minor-pentatonic': [1,3.5,4,5,7.5]
  }

  constructor() { }

  getChromaticScaleForRootNoteAndOctave(rootNote: string, octave: number = 3) {
    const rootIndex = this.notes.findIndex(note => note === rootNote);
    let tmpOctave = octave;
    let notes: string[] = [];
    let index = rootIndex;
    for(let i = rootIndex; i < (12 + rootIndex); i++) {
      if(index == 12) {
        index = 0;
        tmpOctave++;
      }
      notes.push(this.notes[index] + tmpOctave);
      index++;
    }
    return notes;
  }

  getScaleForFormula(formular: string, rootNote: string, octave: number = 3): string[] {
    const baseNotes: string[] = this.getChromaticScaleForRootNoteAndOctave(rootNote, octave);
    let notes: string[] = [rootNote + octave];
    let rootIndex = 0;
    this.formulas[formular].forEach((stepCount: number): void => {
      const note: string = baseNotes[rootIndex + stepCount];
      notes.push(note);
      rootIndex += stepCount;
    })
    return notes;
  }

  getMajorScaleForRoot(rootNote: string, octave: number = 3): string[] {
    return this.getScaleForFormula('major', rootNote, octave);
  }

  getMinorScaleForRootNote(rootNote: string, octave:number = 3, type: 'natural' | 'harmonic' | 'melodic' = 'natural'): string[] {
    return this.getScaleForFormula(type + '-' + 'minor', rootNote, octave);
  }

  getDorianModeForRootNote(rootNote: string, octave:number = 3): string[] {
    return this.getScaleForFormula('dorian-mode', rootNote, octave);
  }


  getMixolydianModeForRootNote(rootNote: string, octave:number = 3): string[] {
    return this.getScaleForFormula('mixolydian-mode', rootNote, octave);
  }

  getMajorPentatonicForRootNote(rootNote: string, octave:number = 3): string[] {
    const baseScale = this.getMajorScaleForRoot(rootNote, octave);
    let notes: string[] = [];
    this.formulas['major-pentatonic'].forEach((noteIndex: number):void => {
      notes.push(baseScale[noteIndex - 1]);
    })
    return notes;
  }

  getMinorPentatonicForRootNote(rootNote: string, octave:number = 3, type: 'natural' | 'harmonic' | 'melodic' = 'natural'): string[] {
    const baseScale = this.getMinorScaleForRootNote(rootNote, octave);
    let notes: string[] = [];
    this.formulas['minor-pentatonic'].forEach((noteIndex: number):void => {
      let newNoteIndex = noteIndex
      if(!Number.isInteger(noteIndex)) {
        newNoteIndex = Math.floor(noteIndex);
      }
      notes.push(baseScale[newNoteIndex - 1]);
    })
    return notes;
  }

  getRandomizedNotesForScale(formula: string, rootNote: string, rootOctave: number, octaveRange: number, numberOfNotes: number): string[] {
    let scale: string[] = []
    for(let i: number = 0; i < octaveRange; i++) {
      const tmpScale: string[] = this.getScaleForFormula(formula, rootNote, rootOctave + i);
      scale = scale.concat(tmpScale);
    }
    const randomNotes: string[] = [];
    for(let i: number = 0; i < numberOfNotes; i++) {
      const rand: number = getRandomInt(0, scale.length - 1);
      randomNotes.push(scale[rand]);
    }
    return randomNotes;
  }
}
