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
  @Input() midiLearn: boolean = false;
  @Input() midiLearnEditMode: boolean = false;
  @Input() negativeValuePrefix: string = 'L';
  @Input() positiveValuePrefix: string = 'R';
  @Input() zeroValueReplacement: string = 'C';

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  private mouseDown: boolean = false;
  private mouseDownStartY: number = 0;
  private tmpValue: number = 0;
  private rangeIndicator: number = 71;

  private valueToAngle(value: number): number {
    const twelveOClock: number= -Math.PI/2;
    const fullCircle: number= Math.PI*2;
    return(twelveOClock+fullCircle*(value/275));
  }



  get displayValue(): string {
    if(this.value === 0) return this.zeroValueReplacement;
    return this.value > 0 ? this.positiveValuePrefix + this.value : this.negativeValuePrefix + this.value * -1;
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
    this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ -this.rangeIndicator, this.rangeIndicator ] );
  }

  @HostListener('document: mouseup')
  handleMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if(this.mouseDown) {
      const difference: number = Math.round((this.mouseDownStartY-event.clientY));
      this.tmpValue += difference
      this.mouseDownStartY = event.clientY;
      if(this.tmpValue >= this.rangeIndicator) this.tmpValue = this.rangeIndicator;
      if(this.tmpValue <= -this.rangeIndicator) this.tmpValue = -this.rangeIndicator;
      this.value = Math.round(this.convertRange( this.tmpValue, [ -this.rangeIndicator, this.rangeIndicator ], [ this.min, this.max ] )/this.step) * this.step;
      this.onChange(this.value);
      this.draw();
    }
  }

  private convertRange( value: number, r1: any, r2: any ): number {
    return (( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ]);
  }

  draw() {
    const counterClockwise: boolean = this.value < 0;
    let value: number = this.convertRange(this.value, [this.min, this.max], [-100, 100]);
    if(counterClockwise) {
      value = value -10;
    } else if (value === 0) {
      value = 0;
    } else {
      value = value + 10;
    }

    if(!this.knobCanvas) return;
    const context = this.knobCanvas.nativeElement.getContext("2d");
    context.clearRect(0, 0, this.knobCanvas.nativeElement.width, this.knobCanvas.nativeElement.height);
    context.lineWidth = this.baseLineWidth;
    context.strokeStyle = this.baseColor;
    context.beginPath();
    context.arc(this.size / 2, this.size / 2, (this.size / 2) - this.baseLineWidth, this.valueToAngle(-110), this.valueToAngle(110));
    context.stroke();
    context.closePath();
    context.lineWidth = this.valueLineWidth;
    context.strokeStyle = this.valueColor;
    context.beginPath();
    context.arc(this.size / 2, this.size / 2, (this.size / 2) - (this.baseLineWidth + this.valueLineWidth), this.valueToAngle(0), this.valueToAngle(value), counterClockwise);
    context.stroke();
    context.closePath();
  }

  ngAfterViewInit(): void {
    this.rangeIndicator = this.size;
    this.draw();
  }
}
