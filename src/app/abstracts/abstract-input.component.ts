import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';

@Component({
    template: '',
    standalone: true,
})
export class AbstractInputComponent<T = any> implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() label: string | undefined;
  @Input() id: string = uuidv4()
  @Input() name: string = uuidv4();
  @Input() disabled: boolean = false;
  @Input() set value(value: T) {
    this._value = value;
    this.onChange(value);
  }

  get value(): T | undefined {
    return this._value;
  }

  @Output() change: any = new EventEmitter<T>();

  protected _value: T | undefined;

  constructor() { }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onChange = (value: T): void => {
    this.change.emit(value);
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    this.value = value;
  }
}
