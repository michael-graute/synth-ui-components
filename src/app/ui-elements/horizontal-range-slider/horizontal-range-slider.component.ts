import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding, HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {v4 as uuidv4} from "uuid";

export type ChangeEventPayload = {
  old: number[];
  new : number[];
}

@Component({
  selector: 'ins-horizontal-range-slider',
  templateUrl: './horizontal-range-slider.component.html',
  styleUrl: './horizontal-range-slider.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: HorizontalRangeSliderComponent
    }
  ]
})
export class HorizontalRangeSliderComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() id: string = uuidv4();
  @HostBinding('id') _id: string = this.id;
  @Input() label: string = '';
  @Input() baseColor: string = '';
  @Input() valueColor: string  = '';
  @Input() hoverColor: string = '';
  @Input() clickColor: string = '';
  @Input() min: number = 0;
  @Input() max: number = 250;
  @Input() step: number = 1;
  @Input() width: number = 250;
  @Input() height: number = 20;
  @Input() labelTextSize: string = 'x-small';
  @Input() labelTextWeight: number = 300;
  @Input() valueTextSize: string = 'small';
  @Input() valueTextWeight: number = 300;

  @Output() change: EventEmitter<ChangeEventPayload> = new EventEmitter<ChangeEventPayload>();
  @Output() contextClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('rangeSliderCanvas') rangeSliderCanvas: ElementRef | undefined;

  public mouseDown: boolean = false;

  private internalValue: number[] = [this.min, this.max];
  private oldValue: number[] = [this.min, this.max];
  private mouseDownStartX: number = 0;
  private mouseOver: boolean = false;


  set value(value: number[])
  {
    this.internalValue = value;
  }

  get value(): number []{
    return this.internalValue;
  }

  @Input()
  set start(value: number) {
    this.internalValue[0] = value;
  }

  get start(): number {
    return this.internalValue[0];
  }

  @Input()
  set stop(value: number) {
    this.internalValue[1] = value;
  }

  get stop(): number {
    return this.internalValue[1];
  }

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

  ngAfterViewInit(): void {
    this.draw();
  }

  ngOnInit(): void {
    this.oldValue = this.value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange = (value: number[]): void => {
    this.change.emit({old: this.oldValue, new: value});
  };

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.internalValue = obj;
    this.draw();
  }


  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.mouseDownStartX = event.clientX;
    this.oldValue = this.value;
    this.draw();
  }

  @HostListener('mouseup')
  handleMouseUp(): void {
    this.mouseDown = false;
    this.triggerValueChange();
    this.draw();
  }

  triggerValueChange(): void {
    if(this.oldValue !== this.value) {
      this.change.emit({old: this.oldValue, new: this.value});
    }
  }

  draw(): void {
    if(!this.rangeSliderCanvas) return;
    const canvas = this.rangeSliderCanvas?.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.baseColor;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = this.valueColor;
      //ctx.fillRect(0, this.width - (this.internalValue[0] - this.min) / (this.max - this.min) * this.width, this.height, (this.internalValue[0] - this.min) / (this.max - this.min) * this.width);
      ctx.fillRect(this.min, 0, 20, 20);
      ctx.fillRect(this.max - this.height, 0, 20, 20);

      ctx.strokeStyle = this.valueColor;
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.setLineDash([5, 4]);
      ctx.moveTo(22, 10);
      ctx.lineTo(228, 10);
      ctx.stroke();
    }
  }

}
