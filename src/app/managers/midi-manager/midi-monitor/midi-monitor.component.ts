import {Component, Inject, OnInit} from '@angular/core';
import {MIDI_MESSAGES, toData, notes, filterByChannel} from "@ng-web-apis/midi";
import {Observable, Subscriber} from "rxjs";
import {map} from 'rxjs/operators';
import * as Tone from "tone";
import {MidiCCEvent, MidiNoteEvent, MidiManagerService} from "../midi-manager.service";
import { NgIf, NgClass } from '@angular/common';


@Component({
    selector: 'ins-midi-monitor',
    templateUrl: './midi-monitor.component.html',
    styleUrls: ['./midi-monitor.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass]
})
export class MidiMonitorComponent implements OnInit {

  readonly notes$: Observable<MidiNoteEvent>;
  readonly controlChanges$: Observable<MidiCCEvent>;

  public midiAccessGranted: boolean = false;

  constructor(@Inject(MIDI_MESSAGES) messages$: Observable<WebMidi.MIDIMessageEvent>, public midiService: MidiManagerService) {
    this.notes$ = messages$.pipe(
      filterByChannel(0),
      notes(),
      toData(),
      map((message: Uint8Array): MidiNoteEvent => this.toInsNote(message))
    );
    this.controlChanges$ = messages$.pipe(
      filterByChannel(0),
      toData(),
      this.controlChange(),
      map((message: Uint8Array): MidiCCEvent => this.toInsControlChange(message)),
    );
  }

  ngOnInit(): void {

    this.notes$.subscribe((note: MidiNoteEvent): void => {
      if(note.on) {
        this.midiService.noteOn(note.note, 1);
      } else {
        this.midiService.noteOff(note.note);
      }
    });
    this.controlChanges$.subscribe((controlChange: MidiCCEvent): void => {
      this.midiService.controlChange(controlChange);
    });
  }

  toInsNote = (message: Uint8Array): MidiNoteEvent => {
    return {
      channel: 1,
      on: message[2] !== 0,
      note: Tone.Frequency(message[1], "midi").toNote(),
      velocity: (1/127) * message[2]
    }
  }

  toInsControlChange = (message: Uint8Array): MidiCCEvent => {
    return {
      channel: 1,
      control: message[1],
      value: message[2]
    }
  }

  controlChange = () => {
    return (source: Observable<Uint8Array>): Observable<Uint8Array> => {
      return new Observable((subscriber: Subscriber<Uint8Array>): void => {
        source.subscribe({
          next(value: Uint8Array): void {
            if(value[0] === 176) {
              subscriber.next(value);
            }
          },
          error(error): void {
            subscriber.error(error);
          },
          complete(): void {
            subscriber.complete();
          }
        })
      });
    }
  }
}
