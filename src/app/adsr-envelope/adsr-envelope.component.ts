import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export interface AdsrEnvelopeValue {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export type canvasPoint = {x: number, y: number};

@Component({
  selector: 'ins-adsr-envelope',
  templateUrl: './adsr-envelope.component.html',
  styleUrls: ['./adsr-envelope.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: AdsrEnvelopeComponent
    }
  ]
})
export class AdsrEnvelopeComponent implements AfterViewInit, ControlValueAccessor {

  @Input() width: number = 200;
  @Input() height: number = 100;
  @Input() knobColor: string = '#00a4e1';
  @Input() lineColor: string = '#00a4e1';
  @Input() lineWidth: number = 2;
  @Input() dotSize: number = 3;


  writeValue(obj: any): void {
      if (obj === null || obj === undefined) return;
      this.attackValue = obj.attack;
      this.decayValue = obj.decay;
      this.sustainValue = obj.sustain;
      this.releaseValue = obj.release;
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

  public onChange = (value: AdsrEnvelopeValue): void => {};

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

  attackValueChanged(event: number) {
    console.log(event);
    this.attackValue = event;
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
    const attackStart: canvasPoint = {y : canvas.height - (this.dotSize), x: this.dotSize};
    const attackEnd: canvasPoint = {y : this.dotSize, x: this.dotSize + ((this.attackValue * 10) * ((canvas.width/4)/100))};
    const sustainStart: canvasPoint = {y : canvas.height - this.dotSize - ((this.sustainValue * 100) * ((canvas.height-this.dotSize*2)/100)), x: attackEnd.x};
    const decayStart: canvasPoint = attackEnd;
    const decayEnd: canvasPoint = {y : sustainStart.y, x: attackEnd.x + (this.decayValue * ((canvas.width/4)/100))};
    const sustainEnd: canvasPoint = {y : sustainStart.y, x: canvas.width - this.dotSize - (this.releaseValue * ((canvas.width/4)/100))};
    const releaseStart: canvasPoint = sustainEnd;
    const releaseEnd: canvasPoint = {y : canvas.height - this.dotSize, x: canvas.width - this.dotSize};
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

}
