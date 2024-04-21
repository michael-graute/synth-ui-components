import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from "uuid";
import {InsAttackReleasePayload, SynthService} from "../../synth.service";
import {ScaleBuilderService} from "./scale-builder.service";
import * as Tone from "tone";
import {SequencerStep} from "../sequencer/sequencer.component";
import {getRandomInt} from "../../utils";

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
    },
    {
      label: 'Dorian Mode',
      value: 'dorian-mode'
    },
    {
      label: 'Mixolydian Mode',
      value: 'mixolydian-mode'
    },
    {
      label: 'Major Pentatonic',
      value: 'major-pentatonic'
    }
    ,
    {
      label: 'Minor Pentatonic',
      value: 'minor-pentatonic'
    }
  ];
  public notes: string[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  public playing: boolean = false;
  public currentPlayingNote: string = '';
  public currentPlayingIndex: number = 0;
  private loop: Tone.Loop | undefined;

  public randomStepCount: number = 16;
  public randomOctaveCount: number = 3;

  constructor(private scaleBuilderService: ScaleBuilderService, private synthService: SynthService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  getBaseScale(octave: number|null = null): string[] {
    let scale: string[] = [];
    if(null === octave) {
      octave = this.baseOctave;
    }
    if(this.baseScale === 'major-pentatonic') {
      scale = this.scaleBuilderService.getMajorPentatonicForRootNote(this.notes[this.baseNote], octave);
    } else if(this.baseScale === 'minor-pentatonic') {
      scale = this.scaleBuilderService.getMinorPentatonicForRootNote(this.notes[this.baseNote], octave);
    } else {
      scale = this.scaleBuilderService.getScaleForFormula(this.baseScale, this.notes[this.baseNote], octave);
    }
    return scale;
  }

  generateScale() {
    this.currentGeneratedScale = this.getBaseScale();
  }

  randomizeScale(): void {
    let scale: string[] = []
    for(let i: number = 0; i < this.randomOctaveCount; i++) {
      const tmpScale: string[] = this.getBaseScale(this.baseOctave + i);
      scale = scale.concat(tmpScale);
    }
    const randomNotes: string[] = [];
    for(let i: number = 0; i < this.randomStepCount; i++) {
      const rand: number = getRandomInt(0, scale.length - 1);
      randomNotes.push(scale[rand]);
    }
    this.currentGeneratedScale = randomNotes;
  }

  noteButtonDown(note: string) {
    this.synthService.noteOn(note);
  }

  noteButtonUp(note: string) {
    this.synthService.noteOff(note);
  }

  play(): void {
    this.playing = true;
    let index = 0;
    let backward = false;
    this.loop = new Tone.Loop((time: number): void => {
      const note: string = this.currentGeneratedScale[index];
      const attackReleaseOptions: InsAttackReleasePayload = {
        note: note,
        duration: "4n",
        velocity: 1,
        time: time
      }
      this.synthService.attackRelease(attackReleaseOptions);
      this.currentPlayingNote = note;
      this.currentPlayingIndex = index;
      this.changeDetectorRef.detectChanges();
      if(index === 0 || (index < this.currentGeneratedScale.length - 1 && !backward)) {
        index = (index + 1);
      } else {
        backward = true;
        index = (index - 1);
        if(index === 0) {
          backward = false;
        }
      }
    }, "4n").start(0);
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();
  }

  stop(): void {
    this.playing = false;
    this.loop?.stop();
    Tone.Transport.stop();
    Tone.Transport.loopStart = 0;
  }
}
