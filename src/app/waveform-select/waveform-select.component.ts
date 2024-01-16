import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'ins-waveform-select',
  templateUrl: './waveform-select.component.html',
  styleUrls: ['./waveform-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: WaveformSelectComponent
    }
  ]
})
export class WaveformSelectComponent implements ControlValueAccessor {
  @Input() label: string | undefined;
  @Input() id: string = uuidv4()
  @Input() waveform: string = 'sine';
  @Input() set value(value: string) {
    this.internalValue = value;
    this.onChange(this.value)
  }

  @Output() waveformChange: EventEmitter<string> = new EventEmitter<string>();

  public internalValue: string = 'triangle';

  get value(): string {
    return this.internalValue;
  }

  public onChange = (value: string): void => {
    this.waveformChange.emit(value);
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: string): void {
    this.value = value;
  }
}
