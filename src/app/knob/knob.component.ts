import {AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'ins-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: KnobComponent
    }
  ]
})
export class KnobComponent implements AfterViewInit, ControlValueAccessor {

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

  @ViewChild('knobCanvas') knobCanvas: ElementRef | undefined;
  @ViewChild('knobEditorInput') knobEditorInput: ElementRef | undefined;

  private mouseDown: boolean = false;
  private mouseDownStartY: number = 0;
  public editMode: boolean = false;
  private tmpValue: number = 0;
  private internalValue: number = 0;

  get value(): number {
    return this.internalValue;
  }

  @Input() set value(value: number) {
    this.internalValue = value;
    this.onChange(this.value);
    this.draw();
  }

  public writeValue(obj: any): void {
    if(obj === null || obj === undefined) return;
    this.value = obj;
    this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, 71 ] );
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    console.log(fn)
  }

  public setDisabledState?(isDisabled: boolean): void {
    console.log(isDisabled);
  }

  public onChange = (value: number): void => {};

  ngAfterViewInit(): void {
    this.draw();
    this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, 71 ] );
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.mouseDownStartY = event.clientY;
  }

  @HostListener('mouseup')
  handleMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if(this.mouseDown) {
      const difference = Math.round((this.mouseDownStartY-event.clientY));
      this.tmpValue += difference
      if(this.tmpValue >= 71) this.tmpValue = 71; this.mouseDownStartY = event.clientY;
      if(this.tmpValue <= 0) this.tmpValue = 0; this.mouseDownStartY = event.clientY;
      this.value = Math.round(this.convertRange( this.tmpValue, [ 0, 71 ], [ this.min, this.max ] ));
    }
  }

  @HostListener('dblclick')
  handleDoubleClick(): void {
    this.editMode = true;
    setTimeout(() => { //@TODO DIRTY!!! Check why timeout is needed here and fix!
      if(!this.knobEditorInput) return;
      this.knobEditorInput.nativeElement.value = this.value;
      this.knobEditorInput.nativeElement.focus();
    }, 100);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if(!this.knobEditorInput) return;
    if(event.target !== this.knobEditorInput.nativeElement) {
      this.editMode = false;
    }
  }

  @HostListener('document:mouseup')
  handleDocumentMouseUp(): void {
    if(this.mouseDown) {
      this.mouseDown = false;
    }
  }

  handleEditorKeyDown(event: KeyboardEvent): void {
    const target: HTMLInputElement = event.currentTarget as HTMLInputElement;
    if(event.key === 'Enter') {
      this.editMode = false;
      this.value = target.value === '' || target.value === null ? this.min : target.valueAsNumber;
      if(this.value > this.max) this.value = this.max;
      if(this.value < this.min) this.value = this.min;
      target.value = this.value + '';
    } else if(event.key === 'Escape') {
      this.editMode = false;
    }
  }

  draw(): void {
    const value: number = this.convertRange( this.internalValue, [ this.min, this.max ], [ 0.5, 2 ] )
    if(this.knobCanvas) {
      const element = this.knobCanvas.nativeElement;
      const context = element.getContext('2d');
      context.clearRect(0, 0, element.width, element.height);
      context.lineWidth = this.baseLineWidth;
      context.beginPath();
      context.arc(this.size / 2, this.size / 2, (this.size / 2) - this.baseLineWidth, Math.PI/2, 2 * Math.PI);
      context.strokeStyle = this.baseColor;
      context.stroke();
      context.closePath();
      context.lineWidth = this.valueLineWidth;
      context.strokeStyle = this.valueColor;
      context.beginPath();
      context.arc(this.size / 2, this.size / 2, (this.size / 2) - (this.baseLineWidth + this.valueLineWidth), Math.PI/2, value * Math.PI);
      context.stroke();
      context.closePath();
    }
  }

  convertRange( value: number, r1: any, r2: any ): number {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

}
