import {Component, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";

export interface ButtonGroupOption {
  label: string;
  value: string;
}

@Component({
  selector: 'ins-button-group',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    NgClass
  ],
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: ButtonGroupComponent
    }
  ]
})
export class ButtonGroupComponent implements ControlValueAccessor {

  @Input() public label: string = '';
  @Input() public name: string = '';
  @Input() public id: string = '';
  @Input() public set value(value: string) {
    this.internalValue = value;
    this.onChange(this.value)
  }
  @Input() public options: ButtonGroupOption[] = [];

  private internalValue: string = '';

  get value(): string {
    return this.internalValue;
  }

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

  onChange(value: string) {
  }

  buttonClick(value: string): void {
    this.internalValue = value;
    this.onChange(value);
  }
}
