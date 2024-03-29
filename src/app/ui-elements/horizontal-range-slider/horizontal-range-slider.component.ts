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
import {SliderHandle} from "./SliderHandle";

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
  @Input() width: number = 800;
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
  private startHandle: SliderHandle = new SliderHandle(0,0, this.height, this.height);
  private stopHandle: SliderHandle = new SliderHandle(this.width - this.height,0, this.height, this.height);


  set value(value: number[])
  {
    this.start = value[0];
    this.stop = value[1];
  }

  get value(): number []{
    return this.internalValue;
  }

  @Input()
  set start(value: number) {
    this.internalValue[0] = value;
    this.startHandle.x = value;
    this.draw();
  }

  get start(): number {
    return this.internalValue[0];
  }

  @Input()
  set stop(value: number) {
    this.internalValue[1] = value;
    this.stopHandle.x = value;
    this.draw();
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
    console.log(this.startHandle.hitTest([event.offsetX, event.offsetY]));
    console.log(this.stopHandle.hitTest([event.offsetX, event.offsetY]));
    this.start = Math.min(Math.max(this.start + this.calculateDelta(event), this.min), this.max);
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseout', ['$event'])
  handleMouseUpOrOut(event: MouseEvent): void {
    this.mouseDown = false;
    this.triggerValueChange();
    this.startHandle.hover = false;
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    if(this.startHandle.hitTest([event.offsetX, event.offsetY])) this.startHandle.hover = true;
    this.draw();
    if (!this.mouseDown) return;
      const startValue = Math.floor(Math.min(Math.max(this.start + this.calculateDelta(event), this.min), this.max));
      console.log('startValue', startValue);
      console.log('startPosition', this.calculateHandlePositionForValue(startValue));
      this.startHandle.x = this.calculateHandlePositionForValue(startValue);
      //this.start += event.offsetX - this.mouseDownStartX;
      //console.log(this.start);
  }

  calculateDelta(event: MouseEvent): number {
    const delta: number = event.clientX - this.mouseDownStartX;
    return delta / this.width * (this.max - this.min);
  }

  calculateHandlePositionForValue(value: number) {
    return (value - this.min) / (this.max - this.min) * this.width
  }

  triggerValueChange(): void {
    if(this.oldValue !== this.value) {
      this.change.emit({old: this.oldValue, new: this.value});
    }
  }

  draw(): void {
    if(!this.rangeSliderCanvas) return;
    const canvas: HTMLCanvasElement = this.rangeSliderCanvas?.nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.baseColor;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = this.valueColor;

      ctx.strokeStyle = this.valueColor;
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.setLineDash([5, 4]);
      this.startHandle.draw(ctx);
      this.stopHandle.draw(ctx);
      ctx.lineTo(228, 10);
      ctx.stroke();
    }
  }

}
