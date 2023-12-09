import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

export interface AdsrEnvelopeValue {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

@Component({
  selector: 'ins-adsr-envelope',
  templateUrl: './adsr-envelope.component.html',
  styleUrls: ['./adsr-envelope.component.scss']
})
export class AdsrEnvelopeComponent implements AfterViewInit {

  @ViewChild('myCanvas') myCanvas: ElementRef | undefined;
  @Input() set value(value: AdsrEnvelopeValue) {
    this.internalAttackValue = value.attack;
    this.internalDecayValue = value.decay;
    this.internalSustainValue = value.sustain;
    this.internalReleaseValue = value.release;
    this.draw();
  }

  private internalAttackValue: number = 0;
  private internalDecayValue: number = 0;
  private internalSustainValue: number = 0;
  private internalReleaseValue: number = 0;

  get value(): AdsrEnvelopeValue {
    return {
      attack: this.internalAttackValue,
      decay: this.internalDecayValue,
      sustain: this.internalSustainValue,
      release: this.internalReleaseValue
    };
  }

  set attackValue(value: number) {
    this.internalAttackValue = value;
    this.draw();
  }

  get attackValue(): number {
    return this.internalAttackValue;
  }

  set decayValue(value: number) {
    this.internalDecayValue = value;
    this.draw();
  }

  get decayValue(): number {
    return this.internalDecayValue;
  }

  set sustainValue(value: number) {
    this.internalSustainValue = value;
    this.draw();
  }

  get sustainValue(): number {
    return this.internalSustainValue;
  }

  set releaseValue(value: number) {
    this.internalReleaseValue = value;
    this.draw();
  }

  get releaseValue(): number {
    return this.internalReleaseValue;
  }

  draw(): void {
    if (!this.myCanvas) {
      return;
    }
    const attackStart = this.myCanvas.nativeElement.height - 5;
    const attackEnd = attackStart - this.attackValue * 10;
    const decayEnd = attackEnd + this.decayValue * 10;
    const line = this.myCanvas.nativeElement.getContext('2d');
    line.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
    line.beginPath();
    line.moveTo(5, attackStart);
    line.lineTo(55, attackEnd);
    line.lineWidth = 3;
    line.strokeStyle = '#00a4e1';
    line.fillStyle = '#00a4e1';
    line.stroke();
    line.closePath();
    line.beginPath();
    line.arc(55, attackEnd, 4, 0, 2 * Math.PI, false);
    line.fill();
    line.closePath();
    line.beginPath();
    line.moveTo(55, attackEnd);
    line.lineTo(100, decayEnd);
    line.stroke();
    line.closePath();
    line.beginPath();
    line.arc(100, decayEnd, 4, 0, 2 * Math.PI, false);
    line.fill();
    line.closePath();
    line.beginPath();
    line.moveTo(100, decayEnd);
    line.lineTo(100 + this.sustainValue * 10, decayEnd);
    line.stroke();
    line.closePath();
    line.beginPath();
    line.arc(100 + this.sustainValue * 10, decayEnd, 4, 0, 2 * Math.PI, false);
    line.fill();
    line.closePath();
    line.beginPath();
    line.moveTo(100 + this.sustainValue * 10, decayEnd);
    line.lineTo(100 + (this.sustainValue * 10) + (this.releaseValue * 10) , attackStart);
    line.stroke();
    line.fill();
  }

  ngAfterViewInit() {
    this.draw();
    console.log(this.value);
  }

}
