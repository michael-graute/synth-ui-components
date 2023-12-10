import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'ins-panning-knob',
  templateUrl: './panning-knob.component.html',
  styleUrls: ['./panning-knob.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: PanningKnobComponent
    }
  ]
})
export class PanningKnobComponent implements AfterViewInit, ControlValueAccessor {

  @ViewChild('knobCanvas') knobCanvas: ElementRef | undefined;

  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() baseColor: string = 'grey';
  @Input() valueColor: string = '#00a4e1';
  @Input() size: number = 50;
  @Input() baseLineWidth: number = 5;
  @Input() valueLineWidth: number = 3;
  @Input() min: number = 0;
  @Input() max: number = 10;
  @Input() step: number = 1;
  @Input() labelTextSize: string = 'x-small';
  @Input() labelTextWeight: number = 300;
  @Input() valueTextSize: string = 'small';
  @Input() valueTextWeight: number = 300;

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  private mouseDown: boolean = false;
  private mouseDownStartY: number = 0;
  private tmpValue: number = 0;

  private valueToAngle(value: number): number {
    const twelveOClock: number= -Math.PI/2;
    const fullCircle: number= Math.PI*2;
    return(twelveOClock+fullCircle*(value/275));
  }

  get displayValue(): string {
    if(this.value === 0) return 'C';
    return this.value > 0 ? 'R' + this.value : 'L' + this.value * -1;
  }

  public writeValue(obj: any): void {
    if(obj === null || obj === undefined) return;
    this.value = obj;
    this.draw();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    ///console.log(fn)
  }

  public setDisabledState?(isDisabled: boolean): void {
    //console.log(isDisabled);
  }

  public onChange = (value: number): void => {
    this.change.emit(value);
  };

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    this.tmpValue = this.value;
    this.mouseDown = true;
    this.mouseDownStartY = event.clientY;
  }

  @HostListener('document: mouseup')
  handleMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if(this.mouseDown) {
      const difference = Math.round((this.mouseDownStartY-event.clientY)/(this.size/100));
      this.tmpValue += difference
      if(this.tmpValue >= 100) this.tmpValue = 100; this.mouseDownStartY = event.clientY;
      if(this.tmpValue <= -100) this.tmpValue = -100; this.mouseDownStartY = event.clientY;
      this.value = this.tmpValue;
      this.onChange(this.value);
      this.draw();
    }
  }

  draw() {
    const counterClockwise: boolean = this.value < 0;
    if(!this.knobCanvas) return;
    const context = this.knobCanvas.nativeElement.getContext("2d");
    context.clearRect(0, 0, this.knobCanvas.nativeElement.width, this.knobCanvas.nativeElement.height);
    context.lineWidth = this.baseLineWidth;
    context.strokeStyle = this.baseColor;
    context.beginPath();
    context.arc(this.size / 2, this.size / 2, (this.size / 2) - this.baseLineWidth, this.valueToAngle(-100), this.valueToAngle(100));
    context.stroke();
    context.closePath();
    context.lineWidth = this.valueLineWidth;
    context.strokeStyle = this.valueColor;
    context.beginPath();
    context.arc(this.size / 2, this.size / 2, (this.size / 2) - (this.baseLineWidth + this.valueLineWidth), this.valueToAngle(0), this.valueToAngle(this.value), counterClockwise);
    context.stroke();
    context.closePath();
  }

  ngAfterViewInit(): void {
    this.draw();
  }
}
