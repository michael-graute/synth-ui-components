import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'ins-panning-knob',
  templateUrl: './panning-knob.component.html',
  styleUrls: ['./panning-knob.component.scss']
})
export class PanningKnobComponent implements AfterViewInit {

  @ViewChild('knobCanvas') knobCanvas: ElementRef | undefined;

  value: number = 75;
  private valueToAngle(value: number): number {
    const twelveOClock: number= -Math.PI/2;
    const fullCircle: number= Math.PI*2;
    return(twelveOClock+fullCircle*(value/275));
  }

  draw() {
    const counterClockwise: boolean = this.value < 0;
    if(!this.knobCanvas) return;
    const ctx = this.knobCanvas.nativeElement.getContext("2d");
    ctx.beginPath();
    ctx.arc(100, 75, 50, this.valueToAngle(0), this.valueToAngle(this.value), counterClockwise);
    ctx.stroke();
  }

  ngAfterViewInit(): void {
    this.draw();
  }
}
