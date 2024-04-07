import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export type SelectOption = {
  label: string;
  value: string;
  tags?: string[];
}

@Component({
  selector: 'ins-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {

  @Input() multiple: boolean = false;
  @Input() tags: boolean = false;
  @Input() options: SelectOption[] = [];
  @Output() change: EventEmitter<string | string[]> = new EventEmitter<string | string[]>();

  private _value: string | string[] = '';
  public isOpen: boolean = false;

  @Input()
  set value(value: string | string[])
  {
    this._value = value;
  }

  get value(): string | string[] {
    return this._value;
  }

  optionSelected(value: string): boolean
  {
    if(this.multiple && Array.isArray(this.value)) {
      return this.value.includes(value);
    } else {
      return this.value === value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onChange() {
    this.change.emit(this.value);
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: string | string[]): void {
    this.value = value;
  }

  getSelectDisplay(): string {
    if(this.multiple && Array.isArray(this.value)) {
      return this.value.join(', ');
    }
    return this.value as string;
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  optionClicked(value: string) {
    if(this.multiple && Array.isArray(this.value)) {
      if (this.optionSelected(value) && this.value.length > 1) {
        this.value.splice(this.value.indexOf(value), 1);
      } else if(!this.optionSelected(value)) {
        this.value.push(value);
      }
    } else {
      this.value = value;
    }
    this.onChange();
  }

  searchBarKeyDown(event: KeyboardEvent) {
    const inputField: HTMLInputElement = event.target as HTMLInputElement
    console.log(inputField.value);
    event.stopPropagation();
  }

}
