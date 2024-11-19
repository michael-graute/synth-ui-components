import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import { NgIf, NgClass, NgFor } from '@angular/common';

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
    ],
    standalone: true,
    imports: [NgIf, NgClass, NgFor]
})
export class SelectComponent implements ControlValueAccessor, OnInit {

  @Input() id: string = uuidv4();
  @Input() label: string | null = null;
  @Input() multiple: boolean = false;
  @Input() searchEnabled: boolean = false;
  @Input() tags: boolean = false;
  @Input() options: SelectOption[] = [];
  @Input() popUpPosition: 'top'|'bottom'|'right' = 'bottom'
  @Output() change: EventEmitter<string | string[]> = new EventEmitter<string | string[]>();

  private _value: string | string[] = '';
  public isOpen: boolean = false;
  public filteredOptions: SelectOption[] = [];

  private _insideClick: boolean = false;

  ngOnInit(): void {
    this.filteredOptions = this.options;
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

  onChange(value: string | string[]): void {
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
      let labels: string[] = [];
      this.value.forEach(value => {
        labels.push(this.options.find(option => option.value === value)?.label ?? '');
      })
      return labels.join(', ');
    }
    return this.options.find(option => option.value === this.value as string)?.label ?? '';
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  optionClicked(value: string): void {
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
    this.onChange(this.value);
  }

  searchBarKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
  }

  searchBarKeyUp(event: KeyboardEvent): void {
    if(event.key !== 'Escape') {
      const inputField: HTMLInputElement = event.target as HTMLInputElement;
      const searchValue = inputField.value.toLowerCase();
      this.filteredOptions = this.options.filter((option: SelectOption) => option.label.toLowerCase().startsWith(searchValue));
      event.stopPropagation();
    } else if(this.isOpen) {
      this.toggleOpen();
    }
  }

  @HostListener('document:keydown', ['$event'])
  documentKeyDown(evt: KeyboardEvent): void {
    if(evt.key === 'Escape' && this.isOpen) {
      this.toggleOpen();
    }
  }

  @HostListener('click')
  clicked(): void {
    this._insideClick = true;
  }

  @HostListener('document:click')
  documentClick(): void{
    if(!this._insideClick && this.isOpen) {
      this.toggleOpen();
    }
    this._insideClick = false;
  }

}
