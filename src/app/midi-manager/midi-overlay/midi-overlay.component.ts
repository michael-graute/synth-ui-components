import {Component, Input} from '@angular/core';
import {MidiManagerService} from "../midi-manager.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {convertRange} from "../../utils";

export type MidiEvent = {
  control: number;
  value: number;
  channel: number;
};

@Component({
  selector: 'ins-midi-overlay',
  templateUrl: './midi-overlay.component.html',
  styleUrl: './midi-overlay.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MidiOverlayComponent
    }
    ]
})
export class MidiOverlayComponent implements ControlValueAccessor{
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  private _value: number = 0;
  midiListen: boolean = false;
  midiLearnEditMode: boolean = false;
  midiEventListener: MidiEvent = { control: 0, value: 0, channel: 0 };

  set value(value: number) {
    this._value = value;
    this.onChange(this._value);
  }

  get value(): number {
    return this._value;
  }

  constructor(public midiManagerService: MidiManagerService ) {
    this.midiManagerService.controlChangeEvent.subscribe((midiEvent: MidiEvent) => {
      this._setValueFromMidiEvent(midiEvent);
    });
    this.midiManagerService.midiLearnControlEvent.subscribe((midiEvent: MidiEvent) => {
      if(this.midiManagerService.midiLearn && this.midiLearnEditMode && !this.midiListen) {
        this.midiEventListener = midiEvent;
        this.midiListen = true;
      }
      this._setValueFromMidiEvent(midiEvent);
    });
  }

  private _setValueFromMidiEvent(midiEvent: MidiEvent): void {
    if(midiEvent.control === this.midiEventListener.control && midiEvent.channel === this.midiEventListener.channel && this.midiListen) {
      this.value = Math.round(convertRange( midiEvent.value, [ 0, 127 ], [ this.min, this.max ] )/ this.step) * this.step;
    }
  }

  toggleMidiLearnEditMode(): void {
    this.midiLearnEditMode = !this.midiLearnEditMode;
  }

  toggleMidiListen(): void {
    this.midiListen = !this.midiListen;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  public onChange = (value: number): void => {
  };

}
