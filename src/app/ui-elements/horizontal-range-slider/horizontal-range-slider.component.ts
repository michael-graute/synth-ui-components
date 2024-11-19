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

export type RangeSliderValue = {
  start: number,
  stop: number
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
    ],
    standalone: true
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
  @Input() max: number = 16;
  @Input() step: number = 1;
  @Input() width: number = 320;
  @Input() height: number = 20;
  @Input() labelTextSize: string = 'x-small';
  @Input() labelTextWeight: number = 300;
  @Input() valueTextSize: string = 'small';
  @Input() valueTextWeight: number = 300;
  @Input() startHandleWidth: number = 20;
  @Input() startHandleHeight: number = this.height;
  @Input() stopHandleWidth: number = 20;
  @Input() stopHandleHeight: number = this.height;

  @Output() change: EventEmitter<ChangeEventPayload> = new EventEmitter<ChangeEventPayload>();
  @Output() contextClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('rangeSliderCanvas') rangeSliderCanvas: ElementRef | undefined;

  private mouseDown: boolean = false;
  private internalValue: RangeSliderValue = {start: this.min, stop: this.max};
  private oldValue: number[] = [this.min, this.max];
  private mouseDownStartX: number = 0;
  // private mouseOver: boolean = false;
  private startHandle: SliderHandle = new SliderHandle(0,0, this.startHandleWidth, this.startHandleHeight, 'start');
  private stopHandle: SliderHandle = new SliderHandle(this.width - this.stopHandleWidth,0, this.stopHandleWidth, this.stopHandleHeight, 'stop');
  private dragObject: SliderHandle | undefined;
  private dragValue: number = 0;


  set value(value: number[])
  {
    this.start = value[0];
    this.stop = value[1];
  }

  get value(): number []{
    return [this.internalValue.start, this.internalValue.stop];
  }

  @Input()
  set start(value: number) {
    this.internalValue.start = value;
    this.startHandle.x = value;
    this.draw();
  }

  get start(): number {
    return this.internalValue.start;
  }

  @Input()
  set stop(value: number) {
    this.internalValue.stop = value;
    this.stopHandle.x = value;
    this.draw();
  }

  get stop(): number {
    return this.internalValue.stop;
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
    this.stopHandle.height = this.stopHandleHeight;
    this.stopHandle.width = this.stopHandleWidth;
    this.stopHandle.x = this.width - this.stopHandleWidth;
    this.startHandle.height = this.startHandleHeight;
    this.startHandle.width = this.startHandleWidth;
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
    this.checkIfHandleIsHit(event);
    this.dragValue = Math.min(Math.max(this.dragValue + this.calculateDelta(event), this.min), this.max);
  }

  @HostListener('mouseup')
  @HostListener('mouseout')
  handleMouseUpOrOut(): void {
    this.mouseDown = false;
    this.dragObject = undefined;
    this.triggerValueChange();
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    if(this.startHandle.hitTest([event.offsetX, event.offsetY])) this.startHandle.hover = true;

    if (!this.mouseDown || !this.dragObject || this.start >= this.stop) {
      if(this.start >= this.stop) this.start = this.start - 1;
      return;
    }
    const dragValue = Math.round(Math.min(Math.max(this.dragValue + this.calculateDelta(event), this.min), this.max));
    console.log('dragValue', dragValue);
    console.log('dragPosition', this.calculateHandlePositionForValue(dragValue));
    this.dragObject.x = this.calculateHandlePositionForValue(dragValue);
    console.log('valueRef', this.dragObject.valueRef);
    // @ts-ignore
    this.internalValue[this.dragObject.valueRef] = dragValue;
    // @ts-ignore
    console.log('start', this.internalValue[this.dragObject.valueRef])
    console.log('stop', this.stop);
    console.log('value', this.value);
    this.draw();
  }

  calculateDelta(event: MouseEvent): number {
    const delta: number = event.clientX - this.mouseDownStartX;
    return delta / this.width * (this.max - this.min);
  }

  calculateHandlePositionForValue(value: number) {
    return (value - this.min) / (this.max - this.min) * this.width
  }

  checkIfHandleIsHit(event: MouseEvent)
  {
    if(this.startHandle.hitTest([event.offsetX, event.offsetY])) {
      this.dragObject = this.startHandle;
      this.dragValue = this.start;
    }
    if(this.stopHandle.hitTest([event.offsetX, event.offsetY])) {
      this.dragObject = this.stopHandle;
      this.dragValue = this.stop;
    }
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
      //background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.baseColor;
      ctx.fillRect(0, 0, this.width, this.height);

      //range indicator
      ctx.strokeStyle = this.valueColor;
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.setLineDash([5, 4]);
      ctx.moveTo(this.startHandle.x, this.height / 2)
      ctx.lineTo(this.stopHandle.x, this.height / 2);
      ctx.stroke();

      //handles
      this.startHandle.draw(ctx);
      this.stopHandle.draw(ctx);
    }
  }

}
