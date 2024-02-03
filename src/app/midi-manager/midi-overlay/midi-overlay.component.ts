import {Component} from '@angular/core';
import {MidiManagerService} from "../midi-manager.service";
import {KnobMidiEvent} from "../../knob/knob.component";

@Component({
  selector: 'ins-midi-overlay',
  templateUrl: './midi-overlay.component.html',
  styleUrl: './midi-overlay.component.scss'
})
export class MidiOverlayComponent {

  midiListen: boolean = false;
  midiLearn: boolean = false;
  midiLearnEditMode: boolean = false;
  midiEventListener: KnobMidiEvent = { control: 0, value: 0, channel: 0 };

  constructor(public midiManagerService: MidiManagerService ) {
  }

  toggleMidiLearnEditMode(): void {
    this.midiLearnEditMode = !this.midiLearnEditMode;
  }

  toggleMidiListen(): void {
    this.midiListen = !this.midiListen;
  }

}
