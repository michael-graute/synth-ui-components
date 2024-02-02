import {EventEmitter, Injectable} from '@angular/core';
import {SynthService} from "../synth.service";
import {InsControlChange} from "./midi-monitor/midi-monitor.component";

@Injectable({
  providedIn: 'root'
})
export class MidiManagerService {

  public midiLearn: boolean = false;
  public midiAccessGranted: boolean = false;

  controlChangeEvent: EventEmitter<InsControlChange> = new EventEmitter<InsControlChange>();
  midiLearnControlEvent: EventEmitter<InsControlChange> = new EventEmitter<InsControlChange>();
  midiLearnToggleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private synthService: SynthService) {
    // @ts-ignore
    navigator.permissions.query({ name: "midi", sysex: true }).then((result: PermissionStatus) => {
      if (result.state === "granted") {
        this.midiAccessGranted = true;
      } else if (result.state === "prompt") {
        return navigator.requestMIDIAccess({ sysex: true }).then((midiAccess: WebMidi.MIDIAccess): void => {
          this.midiAccessGranted = midiAccess.sysexEnabled;
        });
      } else if (result.state === "denied") {
        this.midiAccessGranted = false;
      }
    });
  }

  noteOn(note: string, velocity: number) {
    this.synthService.keyDown(note, velocity);
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
