import { Injectable } from '@angular/core';
import {SynthService} from "./synth.service";

@Injectable({
  providedIn: 'root'
})
export class MidiService {

  public midiLearn: boolean = false;

  constructor(private synthService: SynthService) { }

  noteOn(note: string, velocity: number) {
    this.synthService.keyDown(note);
  }

  noteOff(note: string) {
    this.synthService.keyUp(note);
  }
}
