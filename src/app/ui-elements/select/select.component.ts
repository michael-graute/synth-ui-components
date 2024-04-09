import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class SelectComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input() label: string | null = null;
  @Input() multiple: boolean = false;
  @Input() searchEnabled: boolean = false;
  @Input() tags: boolean = false;
  @Input() options: SelectOption[] = [];
  @Output() change: EventEmitter<string | string[]> = new EventEmitter<string | string[]>();

  private _value: string | string[] = '';
  public isOpen: boolean = false;
  public filteredOptions: SelectOption[] = [];

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  ngAfterViewInit() {

  }

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
      this.toggleOpen();
    }
    this.onChange();
  }

  searchBarKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
  }

  searchBarKeyUp(event: KeyboardEvent): void {
    const inputField: HTMLInputElement = event.target as HTMLInputElement;
    const searchValue = inputField.value.toLowerCase();
    console.log(searchValue);
    this.filteredOptions = this.options.filter((option: SelectOption) => option.label.toLowerCase().startsWith(searchValue));
    console.log(this.filteredOptions);
    event.stopPropagation();
  }

}
