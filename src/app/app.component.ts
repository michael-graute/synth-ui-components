import {Component, OnInit} from '@angular/core';
import {SynthService} from "./synth.service";
import * as Tone from "tone";
import {AppService} from "./app.service";

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
  midiAllowed: boolean = false;
  //osc1 = new Tone.Synth();

  constructor(public synthService: SynthService, private appService: AppService) {
  }

  ngOnInit() {
    // @ts-ignore
    navigator.permissions.query({ name: "midi", sysex: true }).then((result: PermissionStatus) => {
      if (result.state === "granted") {
        this.midiAllowed = true;
      } else if (result.state === "prompt") {
        return navigator.requestMIDIAccess({ sysex: true }).then((midiAccess: WebMidi.MIDIAccess): void => {
          this.midiAllowed = midiAccess.sysexEnabled;
        });
      } else if (result.state === "denied") {
        this.midiAllowed = false;
      }
    });
  }

  public page: string = 'main';


  onKnobChange(event: number) {
    //console.log('knobChange', event);
  }

  savePreset() {
    this.appService.savePreset('init', {components: {}})
  }

  loadPreset() {
    this.appService.loadPreset('init');
  }
}
