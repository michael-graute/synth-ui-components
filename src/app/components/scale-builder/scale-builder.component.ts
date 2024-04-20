import {Component, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from "uuid";
import {SynthService} from "../../synth.service";

@Component({
  selector: 'ins-scale-builder',
  templateUrl: './scale-builder.component.html',
  styleUrl: './scale-builder.component.scss'
})
export class ScaleBuilderComponent implements OnInit {

  @Input() id: string = uuidv4();

  public baseOctave: number = 3;
  public baseNote: number = 0;
  public baseScale: string = 'melodic-minor'
  public currentGeneratedScale: string[] = [];

  public scaleOptions: any[] = [
    {
      label: 'Major',
      value: 'major'
    },
    {
      label: 'Natural Minor',
      value: 'natural-minor'
    },
    {
      label: 'Harmonic Minor',
      value: 'harmonic-minor'
    },
    {
      label: 'Melodic Minor',
      value: 'melodic-minor'
    }
  ];
  public notes: string[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  private formulas: any = {
    'major': [2,2,1,2,2,2],
    'natural-minor': [2,1,2,2,1,2],
    'harmonic-minor': [2,1,2,2,1,3],
    'melodic-minor': [2,1,2,2,2,2],
    'dorian-mode': [2,1,2,2,2,1],
    'mixolydian-mode': [2,2,1,2,2,1],
    'major-pentatonic': [1,2,3,5,6],
    'minor-pentatonic': [1,2.5,4,5,6.5]
  }

  constructor(private synthService: SynthService) {
  }

  ngOnInit() {
    console.log('natural', this.getMinorScaleForRootNote('E', 3));
    console.log('harmonic', this.getMinorScaleForRootNote('E', 3, 'harmonic'));
    console.log('melodic', this.getMinorScaleForRootNote('E', 3, 'melodic'));
    console.log('major', this.getMajorScaleForRoot('E'));
    console.log('major-pentatonic', this.getMajorPentatonicForRootNote('E'));
  }

  buildBaseScaleForRootNoteAndOctave(rootNote: string, octave: number = 3) {
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
    const baseNotes: string[] = this.buildBaseScaleForRootNoteAndOctave(rootNote, octave);
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
    return [];
  }

  generateScale() {
    //console.log(this.baseScale);
    this.currentGeneratedScale = this.getScaleForFormula(this.baseScale, this.notes[this.baseNote], this.baseOctave);
    console.log(this.getScaleForFormula(this.baseScale, this.notes[this.baseNote], this.baseOctave))
  }

  noteButtonDown(note: string) {
    this.synthService.noteOn(note);
  }

  noteButtonUp(note: string) {
    this.synthService.noteOff(note);
  }
}
