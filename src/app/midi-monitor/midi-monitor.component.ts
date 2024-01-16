import {Component, Inject, OnInit} from '@angular/core';
import {MIDI_MESSAGES, toData, notes, filterByChannel} from "@ng-web-apis/midi";
import {Observable, OperatorFunction, Subscriber} from "rxjs";
import {map} from 'rxjs/operators';
import * as Tone from "tone";
import {MidiService} from "../midi.service";

export type InsNote = {
  on: boolean,
  note: string,
  velocity: number
}

export type InsControlChange = {
  control: number,
  on: boolean
}

@Component({
  selector: 'ins-midi-monitor',
  templateUrl: './midi-monitor.component.html',
  styleUrls: ['./midi-monitor.component.scss']
})
export class MidiMonitorComponent implements OnInit{

  readonly notes$: Observable<InsNote>;
  readonly controlChanges$: Observable<any>;

  constructor(@Inject(MIDI_MESSAGES) messages$: Observable<WebMidi.MIDIMessageEvent>, public midiService: MidiService) {
    this.notes$ = messages$.pipe(
      filterByChannel(0),
      notes(),
      toData(),
      map((message: Uint8Array): InsNote => this.toInsNote(message))
    );
    this.controlChanges$ = messages$.pipe(
      filterByChannel(0),
      toData(),
      this.controlChange(),
      map((message: Uint8Array): InsControlChange => this.toInsControlChange(message)),
    );
  }

  ngOnInit(): void {
    this.notes$.subscribe((note: InsNote): void => {
      console.log(note);
      if(note.on) {
        this.midiService.noteOn(note.note, note.velocity);
      } else {
        this.midiService.noteOff(note.note);
      }
    });
    this.controlChanges$.subscribe((controlChange: InsControlChange): void => {
      console.log(controlChange);
    });
  }

  toInsNote = (message: Uint8Array): InsNote => {
    return {
      on: message[2] !== 0,
      note: Tone.Frequency(message[1], "midi").toNote(),
      velocity: (1/127) * message[2]
    }
  }

  toInsControlChange = (message: Uint8Array): InsControlChange => {
    return {
      control: message[1],
      on: message[2] !== 0
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
