import {AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'ins-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.scss']
})
export class KnobComponent implements AfterViewInit{

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
  private _value: number = 6;

  get value(): number {
    return this._value;
  }

  @Input() set value(value: number) {
    this._value = value;
  }

  ngAfterViewInit(): void {
    this.drawKnob(this.convertRange( this.value, [ this.min, this.max ], [ 0.5, 2 ] ));
    this.tmpValue = this.convertRange( this.value, [ this.min, this.max ], [ 0, 71 ] );
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.mouseDownStartY = event.clientY;
  }

  @HostListener('mouseup', ['$event'])
  handleMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

  @HostListener('mouseout', ['$event'])
  handleMouseOut(event: MouseEvent) {
    this.mouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if(this.mouseDown) {
      const difference = Math.round((this.mouseDownStartY-event.clientY)/3);
      this.tmpValue += difference
      if(this.tmpValue >= 71) this.tmpValue = 71;
      if(this.tmpValue <= 0) this.tmpValue = 0;
      const endAngle = this.convertRange( this.tmpValue, [ 0, 71 ], [ 0.5, 2 ] );
      this._value = Math.round(this.convertRange( this.tmpValue, [ 0, 71 ], [ this.min, this.max ] ));
      this.drawKnob(endAngle);
    }
  }

  @HostListener('dblclick', ['$event'])
  handleDoubleClick(event: MouseEvent) {
    this.editMode = true;
    setTimeout(() => {
      if(!this.knobEditorInput) return;
      this.knobEditorInput.nativeElement.value = this.value;
      this.knobEditorInput.nativeElement.focus();
    }, 100);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if(!this.knobEditorInput) return;
    if(event.target !== this.knobEditorInput.nativeElement) {
      this.editMode = false;
    }
  }

  handleEditorKeyDown(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      this.editMode = false;
      // @ts-ignore
      this.value = event.currentTarget.value === '' ? this.min : event.currentTarget.value;
      if(this.value > this.max) this.value = this.max;
      if(this.value < this.min) this.value = this.min;
      // @ts-ignore
      event.currentTarget.value = this.value;
      const endAngle = this.convertRange( this.value, [ this.min, this.max ], [ 0.5, 2 ] );
      this.drawKnob(endAngle);
    } else if(event.key === 'Escape') {
      this.editMode = false;
    }
  }

  drawKnob(value: number) {
    if(this.knobCanvas) {
      const elm = this.knobCanvas.nativeElement;
      const context = elm.getContext('2d');
      context.clearRect(0, 0, elm.width, elm.height);
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
