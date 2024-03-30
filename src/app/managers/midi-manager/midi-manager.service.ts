import {EventEmitter, Injectable} from '@angular/core';
import {SynthService} from "../../synth.service";

export type MidiCCEvent = {
  control: number;
  value: number;
  channel: number;
};

export type MidiNoteEvent = {
  on: boolean;
  note: string;
  velocity: number;
  channel: number;
}

export type MidiListener = {
  type: 'CC' | 'Note';
  event: MidiCCEvent | MidiNoteEvent;
}

export type MidiMap = {
  [key: string]: MidiListener;
}

@Injectable({
  providedIn: 'root'
})
export class MidiManagerService {

  public midiLearn: boolean = false;
  public midiAccessGranted: boolean = false;

  controlChangeEvent: EventEmitter<MidiCCEvent> = new EventEmitter<MidiCCEvent>();
  midiLearnControlEvent: EventEmitter<MidiCCEvent> = new EventEmitter<MidiCCEvent>();
  midiLearnToggleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  midiMapSaveEvent: EventEmitter<void> = new EventEmitter<void>();
  midiMapLoadEvent: EventEmitter<MidiMap> = new EventEmitter<MidiMap>();

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

  controlChange(payload: MidiCCEvent) {
    if(this.midiLearn) {
      this.midiLearnControlEvent.emit(payload);
    } else {
      this.controlChangeEvent.emit(payload);
    }
  }

  saveMidiMap(listener: MidiListener, componentId: string) {
    const midiMapString = localStorage.getItem('InsMidiMap');
    let midiMap: MidiMap = {};
    if(midiMapString) {
      midiMap = JSON.parse(midiMapString);
    }
    midiMap[componentId] = listener;
    localStorage.setItem('InsMidiMap', JSON.stringify(midiMap));
  }

  emitMidiMapSaveEvent() {
    this.midiMapSaveEvent.emit();
  }

  loadMidiMap() {
    const midiMapString = localStorage.getItem('InsMidiMap');
    if(midiMapString) {
      const midiMap: MidiMap = JSON.parse(midiMapString);
      this.midiMapLoadEvent.emit(midiMap);
    }
  }
}
