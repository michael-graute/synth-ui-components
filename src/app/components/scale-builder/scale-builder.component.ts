import {Component, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from "uuid";
import {SynthService} from "../../synth.service";
import {ScaleBuilderService} from "./scale-builder.service";

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
    }
  ];
  public notes: string[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  constructor(private scaleBuilderService: ScaleBuilderService, private synthService: SynthService) {
  }

  ngOnInit() {
  }

  generateScale() {
    //console.log(this.baseScale);
    this.currentGeneratedScale = this.scaleBuilderService.getScaleForFormula(this.baseScale, this.notes[this.baseNote], this.baseOctave);
    console.log(this.scaleBuilderService.getScaleForFormula(this.baseScale, this.notes[this.baseNote], this.baseOctave))
  }

  noteButtonDown(note: string) {
    this.synthService.noteOn(note);
  }

  noteButtonUp(note: string) {
    this.synthService.noteOff(note);
  }
}
