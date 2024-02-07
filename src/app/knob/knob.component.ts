import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, HostBinding,
  HostListener,
  Input, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';

export type KnobMidiEvent = {
  control: number;
  value: number;
  channel: number;
}

export type changeEventPayload = {
  old: number;
  new: number;
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

  @Input() id: string = uuidv4();
  @HostBinding('id') _id: string = this.id;
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

  @Output() change: EventEmitter<changeEventPayload> = new EventEmitter<changeEventPayload>();
  @Output() contextClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('knobCanvas') knobCanvas: ElementRef | undefined;
  @ViewChild('knobEditorInput') knobEditorInput: ElementRef | undefined;
  @ViewChild('knobEditorSelect') knobEditorSelect: ElementRef | undefined;
  @ViewChild('mouseMoveDetector') mouseMoveDetector: ElementRef | undefined;

  public editMode: boolean = false;
  public mouseDown: boolean = false;
  private mouseDownStartY: number = 0;
  private mouseOver: boolean = false;
  private tmpValue: number = 0;
  private internalValue: number = 0;
  private rangeIndicator: number = 71;
  private mouseWheelEvent: WheelEvent | undefined = undefined;
  private valueChangedInterval: any = null;
  private oldValue: number = 0;

  get value(): number {
    return this.internalValue;
  }

  get displayValue(): string {
    if(this.options) {
      return this.options[this.value];
    }
    if(this.type === 'pan') {
      if(this.value === 0) return this.zeroValueReplacement;
      return this.value > 0 ? this.positiveValuePrefix + this.value : this.negativeValuePrefix + this.value * -1;
    }
    return this.value + '';
  }

  @Input() set value(value: number) {
    this.internalValue = Math.round(value * (100 / this.step)) / (100 / this.step);
    this.onChange(this.internalValue);
    this.draw();
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
    this.change.emit({old: this.oldValue, new: value});
  };

  public registerOnTouched(fn: any): void {
    ///console.log(fn)
  }

  public setDisabledState?(isDisabled: boolean): void {
    //console.log(isDisabled);
  }

  ngOnInit() {
    this.oldValue = this.value;
    if(this.options) {
      this.min = 0;
      this.max = this.options.length - 1;
      this.step = 1;
    }
    /*this.midiService.controlChangeEvent.subscribe((midiEvent: KnobMidiEvent) => {
      this.setMidiEventValue(midiEvent);
    });
    this.midiService.midiLearnControlEvent.subscribe((midiEvent: KnobMidiEvent) => {
      if(this.midiLearn && this.midiLearnEditMode && !this.midiListen) {
        this.midiEventListener = midiEvent;
        this.midiListen = true;
      }
      this.setMidiEventValue(midiEvent);
    });*/
    /*this.undoService.undoEvent.subscribe((undoStep: UndoStep) => {
      if(undoStep.componentId === this.id) {
        this.value = undoStep.oldValue;
        this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, this.rangeIndicator ] );
      }
    });*/
  }

  /*setMidiEventValue(midiEvent: KnobMidiEvent): void {
    if(midiEvent.control === this.midiEventListener.control && midiEvent.channel === this.midiEventListener.channel && this.midiListen) {
      this.value = Math.round(this.convertRange( midiEvent.value, [ 0, 127 ], [ this.min, this.max ] )/ this.step) * this.step;
    }
  }*/

  ngAfterViewInit(): void {
    this.rangeIndicator = this.size + this.size / 2;
    this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, this.rangeIndicator ] );
    this.draw();
  }

  @HostListener('contextmenu', ['$event'])
  handleContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextClick.emit(event);
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.mouseDownStartY = event.clientY;
    this.oldValue = this.value;
    this.mouseMoveDetector?.nativeElement.addEventListener('mouseout', () => {
      this.mouseMoveDetector?.nativeElement.removeEventListener('mouseout', () => {});
      this.mouseDown = false;
      this.mouseOver = false;
    });
    this.draw();
  }

  @HostListener('mouseup')
  handleMouseUp(): void {
    this.mouseDown = false;
    this.triggerValueChange();
    this.draw();
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if(this.mouseDown && !this.editMode) {
      const difference: number = Math.round((this.mouseDownStartY-event.clientY));
      this.tmpValue += difference;
      this.mouseDownStartY = event.clientY;
      if(this.tmpValue >= this.rangeIndicator) this.tmpValue = this.rangeIndicator;
      if(this.tmpValue <= 0) this.tmpValue = 0;
      this.value = Math.round(this.convertRange( this.tmpValue, [ 0, this.rangeIndicator ], [ this.min, this.max ] )/this.step) * this.step;
    }
  }

  @HostListener('mouseover')
  handleMouseOver(): void {
    this.mouseOver = true;
    this.draw();
  }

  @HostListener('mouseout')
  handleMouseOut(): void {
    this.mouseOver = false;
    if(this.mouseWheelEvent) this.mouseWheelEvent.stopPropagation();
    this.draw();
  }

  @HostListener('mousewheel', ['$event'])
  handleMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    this.mouseWheelEvent = event;
    if(!this.mouseDown && this.mouseOver) {
      this.tmpValue += event.deltaY/4;
      if(this.tmpValue >= this.rangeIndicator) this.tmpValue = this.rangeIndicator;
      if(this.tmpValue <= 0) this.tmpValue = 0;
      this.value = Math.round(this.convertRange( this.tmpValue, [ 0, this.rangeIndicator ], [ this.min, this.max ] )/this.step) * this.step;
      clearTimeout(this.valueChangedInterval);
      this.valueChangedInterval = setTimeout(() => {
        this.triggerValueChange();
        this.oldValue = this.value;
      }, 100);
    }
  }

  @HostListener('dblclick')
  handleDoubleClick(): void {
    if(!this.editMode) {
      this.oldValue = this.value;
      this.editMode = true;
      if (!this.knobEditorInput) return;
      this.knobEditorInput.nativeElement.value = this.value;
      setTimeout(() => { //prevent overlap of double click and document click
        this.knobEditorInput?.nativeElement.select();
      }, 50);
    }
  }

  handleEditorKeyDown(event: KeyboardEvent): void {
    const target: HTMLInputElement = event.currentTarget as HTMLInputElement;
    if(event.key === 'Enter' || event.key === 'Tab') {
      this.editMode = false;
      this.value = (target.value === '' || target.value === null) ? this.min : target.valueAsNumber;
      if(this.value > this.max) this.value = this.max;
      if(this.value < this.min) this.value = this.min;
      target.value = this.value + '';
      this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, this.rangeIndicator ] );
      this.triggerValueChange();
    } else if(event.key === 'Escape') {
      this.editMode = false;
    }
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
        context.clearRect(0, 0, element.width, element.height);

        //Hover / click fill
        if(this.mouseOver || this.mouseDown) {
          const fillStyle: string = this.mouseDown ? this.clickColor : this.hoverColor;
          context.beginPath();
          context.fillStyle = fillStyle;
          context.arc(this.size / 2, this.size / 2, ((this.size - this.baseLineWidth) / 2), (Math.PI / 180) * 120, (Math.PI / 180) * 420);
          context.fill();
          context.closePath();
        }

        //Outer ring
        context.lineWidth = this.baseLineWidth;
        context.strokeStyle = this.baseColor;
        context.beginPath();
        context.arc(this.size / 2, this.size / 2, ((this.size - this.baseLineWidth) / 2), (Math.PI / 180) * 120, (Math.PI / 180) * 420);
        context.stroke();
        context.closePath();

        //Inner value indicator ring / dot
        let valueStartAngle: number = 0;
        let valueEndAngle: number = 0;
        const convertedValue:number = this.convertRange(this.value, [this.min, this.max], [(Math.PI / 180) * 120, (Math.PI / 180) * 420]);
        let renderCounterClockwise: boolean = false;

        if (this.type === 'dot' || this.type === 'line') {
          valueStartAngle = this.type === 'line' ? (Math.PI / 180) * 120 : convertedValue - this.dotSize;
          valueEndAngle = this.type === 'line' ? convertedValue : convertedValue + this.dotSize;
          if (this.value === this.min && this.type === 'dot') {
            valueStartAngle = valueStartAngle + this.dotSize;
            valueEndAngle = valueEndAngle + this.dotSize;
          }
          if (this.value === this.max && this.type === 'dot') {
            valueStartAngle = valueStartAngle - this.dotSize;
            valueEndAngle = valueEndAngle - this.dotSize;
          }
        } else if(this.type === 'pan') {
          valueStartAngle = (Math.PI / 180) * 270;
          valueEndAngle = convertedValue;
          renderCounterClockwise = this.value < 0;
        }
        context.lineWidth = this.valueLineWidth;
        context.strokeStyle = this.valueColor;
        context.beginPath();
        context.arc(this.size / 2, this.size / 2, ((this.size - (this.baseLineWidth + (this.valueLineWidth * 2))) / 2), valueStartAngle, valueEndAngle, renderCounterClockwise);
        context.stroke();
        context.closePath();
      }
    }
  }

  private convertRange( value: number, r1: any, r2: any ): number {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

  triggerValueChange(): void {
    //this.midiService.triggerUndo();
    if(this.oldValue !== this.value) {
      //this.undoService.addUndoStep('inputValueChanged', this.id, this.oldValue, this.value);
      //console.log('change', this.id, this.oldValue, this.value);
      this.change.emit({old: this.oldValue, new: this.value});
    }
  }

}
