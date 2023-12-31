import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export interface KnobMidiEvent {
  controller: number;
  value: number;
  channel: number;
}

@Component({
  selector: 'ins-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: KnobComponent
    }
  ]
})
export class KnobComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() type: 'dot' | 'line' = 'line';
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
  @Input() midiEventListener: KnobMidiEvent = { controller: 0, value: 0, channel: 0 };
  @Input() lfo: boolean = false;
  @Input() options: any[] | undefined = undefined;

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('knobCanvas') knobCanvas: ElementRef | undefined;
  @ViewChild('knobEditorInput') knobEditorInput: ElementRef | undefined;
  @ViewChild('knobEditorSelect') knobEditorSelect: ElementRef | undefined;

  public midiListen: boolean = false;
  public editMode: boolean = false;

  private mouseDown: boolean = false;
  private mouseDownStartY: number = 0;
  private mouseOver: boolean = false;
  private tmpValue: number = 0;
  private internalValue: number = 0;
  private rangeIndicator: number = 71;
  private mouseWheelEvent: WheelEvent | undefined = undefined;

  get value(): number {
    return this.internalValue;
  }

  getDisplayValue(): string {
    if(this.options) {
      return this.options[this.value];
    }
    return this.value + '';
  }

  @Input() set value(value: number) {
    this.internalValue = Math.round(value * (100 / this.step)) / (100 / this.step);
    this.onChange(this.internalValue);
    this.draw();
  }

  toggleMidiLearnEditMode(): void {
    this.midiLearnEditMode = !this.midiLearnEditMode;
  }

  toggleMidiListen(): void {
    this.midiListen = !this.midiListen;
    this.midiEventListener = { controller: Math.floor(Math.random() * 100), value: 100, channel: 1 };
  }

  public writeValue(obj: any): void {
    if(obj === null || obj === undefined) return;
    this.internalValue = obj;
    this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, this.rangeIndicator ] );
    this.draw();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange = (value: number): void => {
    this.change.emit(value);
  };

  public registerOnTouched(fn: any): void {
    ///console.log(fn)
  }

  public setDisabledState?(isDisabled: boolean): void {
    //console.log(isDisabled);
  }

  ngOnInit() {
    if(this.options) {
      this.min = 0;
      this.max = this.options.length - 1;
      this.step = 1;
    }
  }

  ngAfterViewInit(): void {
    this.rangeIndicator = this.size + this.size / 2;
    this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, this.rangeIndicator ] );
    this.draw();
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
    if(this.mouseDown && !this.editMode && !this.midiLearn) {
      const difference: number = Math.round((this.mouseDownStartY-event.clientY));
      this.tmpValue += difference;
      this.mouseDownStartY = event.clientY;
      if(this.tmpValue >= this.rangeIndicator) this.tmpValue = this.rangeIndicator;
      if(this.tmpValue <= 0) this.tmpValue = 0;
      this.value = Math.round(this.convertRange( this.tmpValue, [ 0, this.rangeIndicator ], [ this.min, this.max ] )/this.step) * this.step;
    }
  }

  @HostListener('mouseover', ['$event'])
  handleMouseOver(event: MouseEvent): void {
    this.mouseOver = true;
  }

  @HostListener('mouseout', ['$event'])
  handleMouseOut(event: MouseEvent): void {
    this.mouseOver = false;
    if(this.mouseWheelEvent) this.mouseWheelEvent.stopPropagation();
  }

  @HostListener('mousewheel', ['$event'])
  handleMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    this.mouseWheelEvent = event;
    if(!this.midiLearn && !this.editMode && !this.mouseDown && this.mouseOver) {
      this.tmpValue += event.deltaY/4;
      if(this.tmpValue >= this.rangeIndicator) this.tmpValue = this.rangeIndicator;
      if(this.tmpValue <= 0) this.tmpValue = 0;
      this.value = Math.round(this.convertRange( this.tmpValue, [ 0, this.rangeIndicator ], [ this.min, this.max ] )/this.step) * this.step;
    }
  }

  @HostListener('dblclick')
  handleDoubleClick(): void {
    if(!this.editMode && !this.midiLearn) {
      this.editMode = true;
      setTimeout(() => { //@TODO DIRTY!!! Check why timeout is needed here and fix!
        if (!this.knobEditorInput) return;
        this.knobEditorInput.nativeElement.value = this.value;
        this.knobEditorInput.nativeElement.focus();
      }, 100);
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if(this.knobEditorInput) {
      if (event.target !== this.knobEditorInput.nativeElement) {
        this.editMode = false;
      }
    }
    if(this.knobEditorSelect) {
      if (event.target !== this.knobEditorSelect.nativeElement) {
        this.editMode = false;
      }
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

  handleEditorInputChange(event: any): void {
    this.value = event.target.value;
  }

  handleEditorSelectChange(event: any): void {
    this.value = event.target.value;
    this.editMode = false;
  }

  draw(): void {
    if(this.knobCanvas) {
      const element: HTMLCanvasElement = this.knobCanvas.nativeElement;
      const context: CanvasRenderingContext2D | null = element.getContext('2d');
      if(context) {
        const convertedValue: number = this.convertRange( this.value, [ this.min, this.max ], [ 0.5, 2 ] );
        const valueStartAngle: number = this.type === 'line' ? Math.PI/2 -.2 : convertedValue * Math.PI - .2;
        context.clearRect(0, 0, element.width, element.height);
        //Outer ring
        context.lineWidth = this.baseLineWidth;
        context.strokeStyle = this.baseColor;
        context.beginPath();
        context.arc(this.size / 2, this.size / 2, (this.size / 2) - this.baseLineWidth, Math.PI / 2 - .2, 2 * Math.PI + .2);
        context.stroke();
        context.closePath();
        //Inner value indicator ring / dot
        context.lineWidth = this.valueLineWidth;
        context.strokeStyle = this.valueColor;
        context.beginPath();
        context.arc(this.size / 2, this.size / 2, (this.size / 2) - (this.baseLineWidth + this.valueLineWidth), valueStartAngle, convertedValue * Math.PI + .2);
        context.stroke();
        context.closePath();
      }
    }
  }

  private convertRange( value: number, r1: any, r2: any ): number {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

}
