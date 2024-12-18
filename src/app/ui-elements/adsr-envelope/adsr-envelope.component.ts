import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import { NgStyle } from '@angular/common';
import { KnobComponent } from '../knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type AdsrEnvelopeValue = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export type ChangeEventPayload = {old: AdsrEnvelopeValue, new: AdsrEnvelopeValue};

export type CanvasPoint = {x: number, y: number};

@Component({
    selector: 'ins-adsr-envelope',
    templateUrl: './adsr-envelope.component.html',
    styleUrls: ['./adsr-envelope.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: AdsrEnvelopeComponent
        }
    ],
    standalone: true,
    imports: [NgStyle, KnobComponent, FormsModule, MidiOverlayComponent]
})
export class AdsrEnvelopeComponent implements AfterViewInit, ControlValueAccessor {

  @Input() id: string = uuidv4();
  @Input() width: number = 200;
  @Input() height: number = 100;
  @Input() knobColor: string = '';
  @Input() lineColor: string = '';
  @Input() lineWidth: number = 2;
  @Input() dotSize: number = 3;
  @Input() midiLearn: boolean = false;
  @Output() change: EventEmitter<ChangeEventPayload> = new EventEmitter<ChangeEventPayload>();


  oldValue: AdsrEnvelopeValue = {attack: 0, decay: 0, sustain: 0, release: 0};

  constructor() {
    const cssKnobColor: string = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    if(cssKnobColor && this.knobColor === '') {
      this.knobColor = cssKnobColor;
    }

    const cssLineColor: string = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    if(cssLineColor && this.lineColor === '') {
      this.lineColor = cssLineColor;
    }
  }

  writeValue(obj: any): void {
      if (obj === null || obj === undefined) return;
      this.attackValue = obj.attack;
      this.decayValue = obj.decay;
      this.sustainValue = obj.sustain;
      this.releaseValue = obj.release;
      this.oldValue = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
      //throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
      //throw new Error('Method not implemented.');
  }

  public onChange = (value: AdsrEnvelopeValue): void => {
    this.change.emit({old: this.oldValue, new: value});
    this.oldValue = value;
  };

  @ViewChild('myCanvas') myCanvas: ElementRef | undefined;
  @Input() set value(value: AdsrEnvelopeValue) {
    this.internalAttackValue = value.attack;
    this.internalDecayValue = value.decay;
    this.internalSustainValue = value.sustain;
    this.internalReleaseValue = value.release;
    this.onChange(this.value);
    this.draw();
  }

  public internalAttackValue: number = 0;
  public internalDecayValue: number = 0;
  public internalSustainValue: number = 0;
  public internalReleaseValue: number = 0;

  get value(): AdsrEnvelopeValue {
    return {
      attack: this.attackValue,
      decay: this.decayValue,
      sustain: this.sustainValue,
      release: this.releaseValue
    };
  }

  set attackValue(value: number) {
    this.internalAttackValue = value;
    this.value.attack = this.internalAttackValue;
    this.onChange(this.value);
    this.draw();
  }

  get attackValue(): number {
    return this.internalAttackValue;
  }

  set decayValue(value: number) {
    this.internalDecayValue = value;
    this.value.decay = this.internalDecayValue;
    this.onChange(this.value);
    this.draw();
  }

  get decayValue(): number {
    return this.internalDecayValue;
  }

  set sustainValue(value: number) {
    this.internalSustainValue = value;
    this.value.sustain = this.internalSustainValue;
    this.onChange(this.value);
    this.draw();
  }

  get sustainValue(): number {
    return this.internalSustainValue;
  }

  set releaseValue(value: number) {
    this.internalReleaseValue = value;
    this.value.release = this.internalReleaseValue;
    this.onChange(this.value);
    this.draw();
  }

  get releaseValue(): number {
    return this.internalReleaseValue;
  }

  draw(): void {
    if (!this.myCanvas) {
      return;
    }
    const canvas = this.myCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const attackStart: CanvasPoint = {y : canvas.height - (this.dotSize), x: this.dotSize};
    const attackEnd: CanvasPoint = {y : this.dotSize, x: this.dotSize + ((this.attackValue) * ((canvas.width/4)/100))};
    const sustainStart: CanvasPoint = {y : canvas.height - this.dotSize - ((this.sustainValue) * ((canvas.height-this.dotSize*2)/100)), x: attackEnd.x};
    const decayStart: CanvasPoint = attackEnd;
    const decayEnd: CanvasPoint = {y : sustainStart.y, x: attackEnd.x + (this.decayValue * ((canvas.width/4)/100))};
    const sustainEnd: CanvasPoint = {y : sustainStart.y, x: canvas.width - this.dotSize - (this.releaseValue * ((canvas.width/4)/100))};
    const releaseStart: CanvasPoint = sustainEnd;
    const releaseEnd: CanvasPoint = {y : canvas.height - this.dotSize, x: canvas.width - this.dotSize};
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.lineColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(attackStart.x,  attackStart.y);
    ctx.lineTo(attackEnd.x, attackEnd.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(attackEnd.x, attackEnd.y, this.dotSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(decayStart.x, decayStart.y);
    ctx.lineTo(decayEnd.x, decayEnd.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(decayEnd.x, decayEnd.y, this.dotSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(decayEnd.x, sustainStart.y);
    ctx.lineTo(sustainEnd.x, sustainEnd.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(sustainEnd.x, sustainEnd.y, this.dotSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(releaseStart.x, releaseStart.y);
    ctx.lineTo(releaseEnd.x, releaseEnd.y);
    ctx.stroke();
    ctx.closePath();
  }

  ngAfterViewInit() {
    this.draw();
  }

  triggerValueChange(): void {
    if(this.oldValue !== this.value) {
      this.change.emit({old: this.oldValue, new: this.value});
      this.oldValue = this.value;
    }
  }

}
