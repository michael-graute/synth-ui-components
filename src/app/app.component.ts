import {Component, OnInit} from '@angular/core';
import {SynthService} from "./synth.service";
import * as Tone from "tone";

@Component({
  selector: 'ins-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  foo: number = 48;
  bar: number = 67;
  pan: number = -34;
  adsr: any = {
    attack: 30,
    decay: 25,
    sustain: .7,
    release: 45
  }
  osc1 = new Tone.Synth();

  constructor(public synthService: SynthService) {
    this.synthService.addOscillator({id: 'osc1', oscillator: this.osc1});
  }

  ngOnInit() {
    this.synthService.noteOnEvent.subscribe((event: any) => {
      console.log('noteOnEvent', event);
    });
    this.synthService.noteOffEvent.subscribe((event: any) => {
      console.log('noteOffEvent', event);
    });
  }

  keyBoardNoteOn(event: any) {
    this.synthService.noteOn(event);
  }

  keyBoardNoteOff(event: any) {
    this.synthService.noteOff(event);
  }

  test: string = 'test';

  public page: string = 'main';

  public midiLearn: boolean = false;

  onKnobChange(event: number) {
    //console.log('knobChange', event);
  }

  toggleMidiLearn() {
    this.midiLearn = !this.midiLearn;
  }
}
