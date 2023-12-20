import {Component, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

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
  @Input() waveform: string = 'sine';
  @Input() set value(value: string) {
    this.internalValue = value;
    this.onChange(this.value)
  }
  public internalValue: string = 'triangle';

  get value(): string {
    return this.internalValue;
  }

  public onChange = (value: string): void => {};

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
