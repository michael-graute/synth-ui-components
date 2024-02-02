import {EventEmitter, Injectable} from '@angular/core';
import {SynthService} from "../synth.service";
import {InsControlChange} from "./midi-monitor/midi-monitor.component";

@Injectable({
  providedIn: 'root'
})
export class MidiManagerService {

  public midiLearn: boolean = false;

  controlChangeEvent: EventEmitter<InsControlChange> = new EventEmitter<InsControlChange>();
  midiLearnControlEvent: EventEmitter<InsControlChange> = new EventEmitter<InsControlChange>();
  midiLearnToggleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private synthService: SynthService) { }

  noteOn(note: string, velocity: number) {
    this.synthService.keyDown(note);
  }

  noteOff(note: string) {
    this.synthService.keyUp(note);
  }

  toggleMidiLearn() {
    this.midiLearn = !this.midiLearn;
    this.midiLearnToggleEvent.emit(this.midiLearn);
  }

  controlChange(payload: InsControlChange) {
    if(this.midiLearn) {
      this.midiLearnControlEvent.emit(payload);
    } else {
      this.controlChangeEvent.emit(payload);
    }
  }
}
