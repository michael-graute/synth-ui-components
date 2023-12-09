import {Component} from '@angular/core';
/*import {jqxKnobComponent} from "jqwidgets-ng/jqxknob";
import {jqxNumberInputComponent} from "jqwidgets-ng/jqxnumberinput";
import {jqxDrawComponent} from "jqwidgets-ng/jqxdraw";*/

@Component({
  selector: 'ins-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /*sliderValue: number = 7;

  attackValue: number = 8;
  decayValue: number = 3;
  sustainValue: number = 5;
  releaseValue: number = 3;
  */

  foo: number = 48;
  bar: number = 67;

  /*@ViewChild('myCanvas') myCanvas: ElementRef | undefined;

  style: any =
    {
      stroke: '#dfe3e9', strokeWidth: 3,
      fill: {
        color: '#fefefe', gradientType: "linear",
        gradientStops: [[0, 1], [50, 0.9], [100, 1]]
      }
    };
  progressBar: any =
    {
      style: { fill: '#00a4e1', stroke: 'grey' },
      size: '9%', offset: '60%',
      background: { fill: 'grey', stroke: 'grey' }
    };
  onAttackChange(event: any): void {
    if (event.args.changeSource == 'propertyChange' || event.args.changeSource == 'val') { return; }
    console.log(event.args.value);
    this.attackValue= event.args.value;
    this.draw();
  }

  onDecayChange(event: any): void {
    if (event.args.changeSource == 'propertyChange' || event.args.changeSource == 'val') { return; }
    console.log(event.args.value);
    this.decayValue= event.args.value;
    this.draw();
  }

  onSustainChange(event: any): void {
    if (event.args.changeSource == 'propertyChange' || event.args.changeSource == 'val') { return; }
    console.log(event.args.value);
    this.sustainValue= event.args.value;
    this.draw();
  }

  onReleaseChange(event: any): void {
    if (event.args.changeSource == 'propertyChange' || event.args.changeSource == 'val') { return; }
    console.log(event.args.value);
    this.releaseValue = event.args.value;
    this.draw();
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
  ngAfterViewInit(): void
  {
    if(this.myCanvas) {
      this.draw();
    }
  }

  handleMouseUp(event: any): void {
    console.log(event);
  }

  handleMouseDown(event: any): void {
    console.log(event);
  }

  handleMouseMove(event: any): void {
    console.log(event);
  }

  convertRange( value: number, r1: any, r2: any ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }*/

}
