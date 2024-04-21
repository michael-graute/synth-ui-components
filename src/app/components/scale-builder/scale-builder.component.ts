import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from "uuid";
import {InsAttackReleasePayload, SynthService} from "../../synth.service";
import {ScaleBuilderService} from "./scale-builder.service";
import * as Tone from "tone";
import {SequencerStep} from "../sequencer/sequencer.component";

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
  private loop: Tone.Loop | undefined;

  constructor(private scaleBuilderService: ScaleBuilderService, private synthService: SynthService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  generateScale() {
    if(this.baseScale === 'major-pentatonic') {
      this.currentGeneratedScale = this.scaleBuilderService.getMajorPentatonicForRootNote(this.notes[this.baseNote], this.baseOctave);
    } else if(this.baseScale === 'minor-pentatonic') {
      this.currentGeneratedScale = this.scaleBuilderService.getMinorPentatonicForRootNote(this.notes[this.baseNote], this.baseOctave);
    } else {
      this.currentGeneratedScale = this.scaleBuilderService.getScaleForFormula(this.baseScale, this.notes[this.baseNote], this.baseOctave);
    }
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
      this.changeDetectorRef.detectChanges();
      index = (index + 1) % this.currentGeneratedScale.length;
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
