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
  barbaz: number = 34;
  pan: number = -34;
  adsr: any = {
    attack: 30,
    decay: 25,
    sustain: 70,
    release: 45
  }
  //osc1 = new Tone.Synth();

  constructor(public synthService: SynthService) {
  }

  ngOnInit() {
  }

  public page: string = 'main';
  public midiLearn: boolean = false;

  onKnobChange(event: number) {
    //console.log('knobChange', event);
  }

  toggleMidiLearn() {
    this.midiLearn = !this.midiLearn;
  }
}
