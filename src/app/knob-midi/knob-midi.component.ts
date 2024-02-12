import {Component, EventEmitter, Input, Output} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'ins-knob-midi',
  templateUrl: './knob-midi.component.html',
  styleUrl: './knob-midi.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: KnobMidiComponent
    }
  ]
})
export class KnobMidiComponent implements ControlValueAccessor{
  @Input() id: string = uuidv4();
  @Input() type: 'dot' | 'line' | 'pan' = 'line';
  @Input() label: string = '';
  @Input() baseColor: string = '';
  @Input() valueColor: string  = '';
  @Input() hoverColor: string = '';
  @Input() clickColor: string = '';
  @Input() size: number = 50;
  @Input() baseLineWidth: number = 5;
  @Input() valueLineWidth: number = 3;
  @Input() dotSize: number = .2;
  @Input() min: number = 0;
  @Input() max: number = 10;
  @Input() step: number = 1;
  @Input() labelTextSize: string = 'x-small';
  @Input() labelTextWeight: number = 300;
  @Input() valueTextSize: string = 'small';
  @Input() valueTextWeight: number = 300;
  @Input() lfo: boolean = false;
  @Input() options: any[] | undefined = undefined;
  @Input() negativeValuePrefix: string = 'L';
  @Input() positiveValuePrefix: string = 'R';
  @Input() zeroValueReplacement: string = 'C';

  @Output() change: EventEmitter<{old: number, new: number}> = new EventEmitter<{old: number, new: number}>();
  private _value: number = 0;

  constructor() {
    const cssValueColor: string = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    if(cssValueColor && this.valueColor === '') {
      this.valueColor = cssValueColor;
    }

    const cssBaseColor: string = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
    if(cssBaseColor && this.baseColor === '') {
      this.baseColor = cssBaseColor;
    }

    const cssHoverColor: string = getComputedStyle(document.documentElement).getPropertyValue('--button-hover-bg');
    if(cssHoverColor && this.hoverColor === '') {
      this.hoverColor = cssHoverColor;
    }

    const cssClickColor: string = getComputedStyle(document.documentElement).getPropertyValue('--button-click-bg');
    if(cssClickColor && this.clickColor === '') {
      this.clickColor = cssClickColor;
    }
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  triggerChangeEvent(evt: any) {
    this.change.emit(evt);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  public onChange = (value: number): void => {
    //this.change.emit({old: this.oldValue, new: value});
  };
}
