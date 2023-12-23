import {Component, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

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
    FormsModule
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
  @Input() public value: string = '';
  @Input() public options: ButtonGroupOption[] = [];

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: string): void {
    console.log(value);
    this.value = value;
  }

  onChange(value: string) {
    console.log(value)
  }
}
