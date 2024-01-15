import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'ins-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: SwitchComponent
    }
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  @HostBinding('id') @Input() id: string = uuidv4();
  @Input() label: string | undefined;
  @Input() onLabel: string = 'on';
  @Input() offLabel: string = 'off';
  @Input() labelPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
  @Input() hasLabel: boolean = true;
  @Input() value: boolean = false;
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  onChange: any = (value: boolean): void => {
    this.change.emit(value);
  };
}
