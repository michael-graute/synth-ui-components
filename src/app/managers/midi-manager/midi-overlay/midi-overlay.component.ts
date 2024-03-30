import {Component, Input} from '@angular/core';
import {MidiCCEvent, MidiManagerService, MidiMap} from "../midi-manager.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {convertRange} from "../../../utils";
import {v4 as uuidv4} from 'uuid';



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
  @Input() id: string = uuidv4();
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  private _value: number = 0;
  midiLearnEditMode: boolean = false;
  midiEventListener: MidiCCEvent = { control: 0, value: 0, channel: 0 };


  get midiListen(): boolean {
    return this.midiEventListener.control !== 0;
  }

  set value(value: number) {
    this._value = value;
    this.onChange(this._value);
  }

  get value(): number {
    return this._value;
  }

  constructor(public midiManagerService: MidiManagerService ) {
    this.midiManagerService.controlChangeEvent.subscribe((midiEvent: MidiCCEvent) => {
      this._setValueFromMidiEvent(midiEvent);
    });
    this.midiManagerService.midiLearnControlEvent.subscribe((midiEvent: MidiCCEvent) => {
      if(this.midiManagerService.midiLearn && this.midiLearnEditMode && !this.midiListen) {
        this.midiEventListener = midiEvent;
      }
      this._setValueFromMidiEvent(midiEvent);
    });
    this.midiManagerService.midiMapSaveEvent.subscribe(() => {
      this.midiManagerService.saveMidiMap({ type: 'CC', event: this.midiEventListener }, this.id);
    });
    this.midiManagerService.midiMapLoadEvent.subscribe((midiMap: MidiMap) => {
      if(midiMap[this.id] && midiMap[this.id].type === 'CC') {
        this.midiEventListener = midiMap[this.id].event as MidiCCEvent;
        this._setValueFromMidiEvent(this.midiEventListener);
      }
    });
  }

  private _setValueFromMidiEvent(midiEvent: MidiCCEvent): void {
    if(midiEvent.control === this.midiEventListener.control && midiEvent.channel === this.midiEventListener.channel && this.midiListen) {
      this.midiEventListener.value = midiEvent.value;
      this.value = Math.round(convertRange( midiEvent.value, [ 0, 127 ], [ this.min, this.max ] )/ this.step) * this.step;
    }
  }

  toggleMidiLearnEditMode(): void {
    if(this.midiManagerService.midiLearn) {
      this.midiLearnEditMode = !this.midiLearnEditMode;
    }
  }

  toggleMidiListen(): void {
    if(this.midiListen) {
      this.midiEventListener = { control: 0, value: 0, channel: 0 };
    }
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
