import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import { NgIf } from '@angular/common';

export type changeEventPayload = {old: string, new: string};

@Component({
    selector: 'ins-waveform-select',
    templateUrl: './waveform-select.component.html',
    styleUrls: ['./waveform-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: WaveformSelectComponent
        }
    ],
    standalone: true,
    imports: [NgIf, FormsModule]
})
export class WaveformSelectComponent implements OnInit, ControlValueAccessor {
  @Input() label: string | undefined;
  @Input() id: string = uuidv4()
  @Input() waveform: string = 'triangle';
  @Input() set value(value: string) {
    this.internalValue = value;
    this.onChange(this.value)
  }

  @Output() waveformChange: EventEmitter<changeEventPayload> = new EventEmitter<changeEventPayload>();

  public internalValue: string = 'triangle';
  public oldValue: string = 'triangle';

  get value(): string {
    return this.internalValue;
  }

  public onChange = (value: string): void => {
    //this.waveformChange.emit(value);
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
    this.oldValue = value;
  }

  triggerValueChange(): void {
    if(this.oldValue !== this.value) {
      this.waveformChange.emit({old: this.oldValue, new: this.value});
    }
    this.oldValue = this.value;
  }

  ngOnInit(): void {
    this.oldValue = this.value;
  }
}
